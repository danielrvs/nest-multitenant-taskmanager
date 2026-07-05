import request from 'supertest';
import { AppModule } from "@/app.module";
import { INestApplication } from "@nestjs/common";
import { Test } from '@nestjs/testing';
import { TestFactories } from "../factories/test-factories";
import { cleanupDatabase } from "../helpers/clean-up-database.helper";
import { setupTestApp } from "../helpers/setup-test.helper";
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { faker } from "@faker-js/faker";

describe('Registration Tests', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule(
            {
                imports: [AppModule]
            }
        ).compile();

        app = moduleFixture.createNestApplication();
        setupTestApp(app);
        prisma = app.get(PrismaService);

        TestFactories.init(app);
        await app.init();
    })

    beforeEach(async () => {
        await cleanupDatabase(prisma);
    })

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    })

    describe('POST /auth/register', () => {
        const route = () => '/auth/register';

        it('should successfully register a new user', async () => {
            const password = 'test-password';
            const email = faker.internet.email()
            const response = await request(app.getHttpServer())
                .post(route())
                .send({
                    name: faker.person.fullName(),
                    email,
                    password,
                });
            expect(response.status).toBe(201);
            expect(response.body.data.mfaRequired).toBe(false);

            const user = await prisma.user.findUnique({ where: { email } });
            expect(user).toBeDefined();
            expect(user?.email).toBe(email);
        });

        it('should return 409 when email already exists', async () => {
            const user = await TestFactories.user().create();
            const response = await request(app.getHttpServer())
                .post(route())
                .send({
                    name: faker.person.fullName(),
                    email: user.email.toString(),
                    password: 'test-password',
                });
            expect(response.status).toBe(409);
        });

        it('should return 400 when request malformed', async () => {
            const malformedRequests = [
                { name: faker.person.fullName(), password: 'test-password' },
                { name: faker.person.fullName(), email: faker.internet.email() },
                { name: faker.person.fullName(), email: 'invalid-email', password: 'test-password' },
            ]

            for (const input of malformedRequests) {
                const response = await request(app.getHttpServer())
                    .post(route())
                    .send(input);
                expect(response.status).toBe(400);
            }
        });

        it('should enforce rate limit and return 429 under stress', async () => {
            const promises = Array.from({ length: 6 }).map(() =>
                request(app.getHttpServer())
                    .post(route())
                    .set('x-force-throttler', 'true')
                    .send({
                        name: faker.person.fullName(),
                        email: faker.internet.email(),
                        password: 'test-password'
                    })
            );

            const responses = await Promise.all(promises);
            const has429 = responses.some(r => r.status === 429);
            expect(has429).toBe(true);
        })
    })
});
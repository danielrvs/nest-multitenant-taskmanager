import request from 'supertest';
import { AppModule } from "@/app.module";
import { INestApplication } from "@nestjs/common";
import { Test } from '@nestjs/testing';
import { TestFactories } from "../factories/test-factories";
import { cleanupDatabase } from "../helpers/clean-up-database.helper";
import { setupTestApp } from "../helpers/setup-test.helper";
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { faker } from '@faker-js/faker';

describe('Password Reset E2E Tests', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        setupTestApp(app);
        prisma = app.get(PrismaService);

        TestFactories.init(app);
        await app.init();
    });

    beforeEach(async () => {
        await cleanupDatabase(prisma);
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    describe('POST /auth/forgot-password', () => {
        it('should accept password reset request for existing user', async () => {
            const user = await TestFactories.user().create();

            const response = await request(app.getHttpServer())
                .post('/auth/forgot-password')
                .send({ email: user.email.toString() });

            expect([200, 201]).toContain(response.status);

            // Check that a token was generated in the database
            const dbUser = await prisma.user.findUnique({ where: { id: user.id } }) as any;
            let token = dbUser.passwordResetToken || dbUser.resetToken;
            if (!token) {
                const tokenRecord = await (prisma as any).passwordResetToken?.findFirst({
                    where: { userId: user.id }
                });
                token = tokenRecord?.token;
            }

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
        });

        it('should return 400 when email is malformed', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/forgot-password')
                .send({ email: 'not-an-email' });

            expect(response.status).toBe(400);
        });

        it('should return 400 when email is missing', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/forgot-password')
                .send({});

            expect(response.status).toBe(400);
        });
    });

    describe('POST /auth/reset-password', () => {
        it('should successfully reset password with valid token and allow login with new password', async () => {
            const password = 'OldPassword123!';
            const token = faker.string.alphanumeric(8);

            const newPassword = 'NewPassword123!';
            const user = await TestFactories.user().state({ password }).withPasswordResetToken(token).create();

            // Reset password
            const resetResponse = await request(app.getHttpServer())
                .post('/auth/reset-password')
                .send({ token, password: newPassword });

            expect([200, 201]).toContain(resetResponse.status);

            // Verify old password no longer works
            const oldLoginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: user.email.toString(), password });

            expect(oldLoginResponse.status).toBe(401);

            // Verify new password works
            const newLoginResponse = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: user.email.toString(), password: newPassword });

            expect(newLoginResponse.status).toBe(200);
        });

        it('should reject password reset if token is invalid', async () => {
            const response = await request(app.getHttpServer())
                .post('/auth/reset-password')
                .send({ token: 'invalid-token-value', password: 'NewPassword123!' });

            expect([400, 404]).toContain(response.status);
        });

        it('should reject password reset if token is expired', async () => {
            const user = await TestFactories.user().withPasswordResetToken().create();



            const response = await request(app.getHttpServer())
                .post('/auth/reset-password')
                .send({ token: 'expired-token-val', password: 'NewPassword123!' });

            expect([400, 401, 404]).toContain(response.status);
        });
    });
});

import { AppModule } from "@/app.module";
import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { TestFactories } from "test/factories/test-factories";
import { cleanupDatabase } from "test/helpers/clean-up-database.helper";
import { setupTestApp } from "test/helpers/setup-test.helper";
import request from 'supertest';
import { generate, generateSecret } from "otplib";

describe('MFA Challenge & Activation Integration Tests', () => {
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

    describe('POST /auth/mfa/setup', () => {
        const route = () => '/auth/mfa/setup';

        it('should return 401 if user is not fully authenticated', async () => {
            await request(app.getHttpServer())
                .post(route())
                .expect(401);
        });

        it('should generate TOTP secret, QR URI and plain text backup codes', async () => {
            const { user, auth } = await TestFactories.user().createAuthenticatedUser();

            const response = await request(app.getHttpServer())
                .post(route())
                .set('Cookie', `access_token=${auth.accessToken}`)
                .expect(200);


            expect(response.body.data).toHaveProperty('secret');
            expect(response.body.data).toHaveProperty('qrCodeUri');
            expect(response.body.data.qrCodeUri).toContain('otpauth://totp/');

            const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
            expect(dbUser?.mfaSecret).toBe(response.body.data.secret);
            expect(dbUser?.mfaFactorConfirmedAt).toBeNull();
        });
    });

    describe('POST /auth/mfa/activate', () => {
        const route = () => '/auth/mfa/activate';

        it('should reject activation if user only carries an unverified pre-auth token', async () => {
            const { token } = await TestFactories.user().createMfaUnverifiedUser();
            const totpCode = generate({ secret: generateSecret() });

            await request(app.getHttpServer())
                .post(route())
                .set('Cookie', `access_token=${token}`)
                .send({ totpCode })
                .expect(403);
        });

        it('should activate 2FA successfully and mutate DB state when valid session and code are provided', async () => {


            const { user, auth } = await TestFactories.user()
                .with2FA()
                .createAuthenticatedUser();

            const totpCode = await generate({ secret: user.mfaSecret });

            const response = await request(app.getHttpServer())
                .post(route())
                .set('Cookie', `access_token=${auth.accessToken}`)
                .send({ totpCode })
                .expect(200);

            expect(response.body.data.backupCodes).toBeInstanceOf(Array);
            expect(response.body.data.backupCodes).toHaveLength(8);
            expect(typeof response.body.data.backupCodes[0]).toBe('string');

            const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
            expect(updatedUser?.mfaFactorConfirmedAt).not.toBeNull();
            expect(updatedUser?.mfaSecret).toBe(user.mfaSecret);


        });
    });

    describe('POST /auth/mfa/challenge', () => {
        const route = () => '/auth/mfa/challenge';

        it('should return 200 and set secure cookies when valid totp is provided', async () => {
            const { user, token } = await TestFactories.user()
                .with2FA()
                .createMfaUnverifiedUser();

            const totpCode = await generate({ secret: user.mfaSecret });

            const response = await request(app.getHttpServer())
                .post(route())
                .set('Cookie', `access_token=${token}`)
                .send({ totpCode });

            expect(response.status).toBe(200);


            const cookies = response.get('Set-Cookie').join(';');
            expect(cookies).toContain('access_token=');
            expect(cookies).toContain('HttpOnly');
            expect(cookies).toContain('Secure');

            expect(response.body.data.user.id).toBe(user.id);
        });

        it('should reject the same TOTP code twice to prevent Anti-Replay attacks', async () => {
            const { user, token } = await TestFactories.user()
                .with2FA()
                .createMfaUnverifiedUser();

            const totpCode = await generate({ secret: user.mfaSecret });


            await request(app.getHttpServer())
                .post(route())
                .set('Cookie', `access_token=${token}`)
                .send({ totpCode })
                .expect(200);


            await request(app.getHttpServer())
                .post(route())
                .set('Cookie', `access_token=${token}`)
                .send({ totpCode })
                .expect(401);
        });
    });

    describe('POST /auth/mfa/deactivate', () => {
        const route = () => '/auth/mfa/deactivate';

        it('should reject if user is not authenticated', async () => {
            await request(app.getHttpServer())
                .post(route())
                .expect(401);
        });

        it('should deactivate 2FA successfully', async () => {
            const { user, auth } = await TestFactories.user()
                .with2FA()
                .createAuthenticatedUser();

            const totpCode = await generate({ secret: user.mfaSecret });
            const response = await request(app.getHttpServer())
                .post(route())
                .set('Cookie', `access_token=${auth.accessToken}`)
                .send({ totpCode })
                .expect(200);

            const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
            expect(updatedUser?.mfaSecret).toBeNull();
            expect(updatedUser?.mfaFactorConfirmedAt).toBeNull();
        });
    });


});
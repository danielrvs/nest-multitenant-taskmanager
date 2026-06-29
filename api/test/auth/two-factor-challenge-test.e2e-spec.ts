import { AppModule } from "@/app.module";
import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { TestFactories } from "test/factories/test-factories";
import { cleanupDatabase } from "test/helpers/clean-up-database.helper";
import { setupTestApp } from "test/helpers/setup-test.helper";

describe('MFA Challenge', () => {
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
    });

    beforeEach(async () => {
        await cleanupDatabase(prisma);
    });

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    });

    const route = (endpoint: string = 'challenge') => `/auth/mfa/${endpoint}`;

    describe('POST /auth/mfa/...', () => {

        it('return 401 when not valid token are provided', async () => {

        });

        it('two factor challenge route return 200 when valid token are provided and with that token return access token and refresh token ', async () => {

        })

        it('two factor challenge route return 400 when request are malformed', async () => {

        })

        it('two factor challenge route return 401 when request doesn\'t have mfa token', async () => {

        })

        it('activate two factor route return 401 when not valid token are provided', async () => {

        })

        it('activate two factor route return 401 when invalid token  challenge provided', async () => {

        })

        it('activate two factor route return 400 when request are malformed', async () => {

        })

        it('activate two factor route return 200 when valid token and challenge are provided', async () => {

        })

    })


});
import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import { INestApplication } from "@nestjs/common"
import { cleanupDatabase } from "../helpers/clean-up-database.helper";
import { AppModule } from "@/app.module";
import { Test } from "@nestjs/testing";
import { setupTestApp } from "../helpers/setup-test.helper";
import { TestFactories } from "../factories/test-factories";
import { UserRole } from "@/modules/users/domain/entities/enums/user-role.enum";
import request from 'supertest';

describe('Task Tenant Isolation Test', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture = await Test.createTestingModule({
            imports: [AppModule]
        }).compile();

        app = moduleFixture.createNestApplication();
        setupTestApp(app)
        prisma = app.get(PrismaService)
        TestFactories.init(app);
        await app.init()
    })

    beforeEach(async () => {
        await cleanupDatabase(prisma)
    })

    afterAll(async () => {
        await prisma.$disconnect();
        await app.close();
    })

    const route = (id: string | null = null) => (id ? `/tasks/${id}` : '/tasks')

    it('a tenant can only see its own tasks', async () => {
        const tenant = await TestFactories.tenant().create();
        const otherTenant = await TestFactories.tenant().create();
        const admin = await TestFactories.user().state({ role: UserRole.ADMIN, tenantId: tenant.id }).createAuthenticatedUser();
        const tasks = await TestFactories.task().state({ tenantId: tenant.id }).createMany(5);
        const otherTasks = await TestFactories.task().state({ tenantId: otherTenant.id }).createMany(5);

        const response = await request(app.getHttpServer())
            .get(route())
            .set('Cookie', `access_token=${admin.auth.accessToken}`)
            .expect(200)

        expect(response.body.data).toHaveLength(5);

        const tenantInResponse = response.body.data.every((task: any) => task.tenantId === tenant.id);
        expect(tenantInResponse).toBe(true);
    })

    it('user cannot find tasks from other tenants', async () => {
        const tenant = await TestFactories.tenant().create();
        const otherTenant = await TestFactories.tenant().create();
        const user = await TestFactories.user().state({ role: UserRole.ADMIN, tenantId: tenant.id }).createAuthenticatedUser();
        const mainTask = await TestFactories.task().state({ tenantId: tenant.id }).create();
        const otherTask = await TestFactories.task().state({ tenantId: otherTenant.id }).create();

        const response = await request(app.getHttpServer())
            .get(route(otherTask.id))
            .set('Cookie', `access_token=${user.auth.accessToken}`)
            .expect(404)

        expect(response.body.data).toBeUndefined();
    })
})
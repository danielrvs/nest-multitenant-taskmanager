import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import { INestApplication } from "@nestjs/common"
import { cleanupDatabase } from "../helpers/clean-up-database.helper";
import { AppModule } from "@/app.module";
import { Test } from "@nestjs/testing";
import { setupTestApp } from "test/helpers/setup-test.helper";
import { TestFactories } from "test/factories/test-factories";
import { UserRole } from "@/modules/users/domain/entities/enums/user-role.enum";
import request from 'supertest';

describe('Task Policy Test', async () => {
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

    const route = (id: string) => (`tasks/${id}`)

    it('should let a admin delete anybody tasks', async () => {
        const tenant = await TestFactories.tenant().create();
        const admin = await TestFactories.user().state({ role: UserRole.ADMIN, tenantId: tenant.id }).createAuthenticatedUser();
        const user = await TestFactories.user().state({ tenantId: tenant.id }).create();
        const task = await TestFactories.task().state({ tenantId: tenant.id, userId: user.id }).create();

        const response = await request(app.getHttpServer())
            .delete(route(task.id))
            .set('Cookie', `access_token=${admin.auth.accessToken}`)
            .expect(204)

        const found = await prisma.task.findUnique({ where: { id: task.id } });
        expect(found).toBeNull();
    })

    it('should let a manager update its tasks', async () => {
        const tenant = await TestFactories.tenant().create();
        const manager = await TestFactories.user().state({ role: UserRole.MANAGER, tenantId: tenant.id }).createAuthenticatedUser();
        const task = await TestFactories.task().state({ tenantId: tenant.id, userId: manager.user.id }).create();

        await request(app.getHttpServer())
            .put(route(task.id))
            .send({ title: 'updated' })
            .set('Cookie', `access_token=${manager.auth.accessToken}`)
            .expect(204)

        const found = await prisma.task.findUnique({ where: { id: task.id } });
        expect(found?.title).toBe('updated');
    })

    it('should not let a viewer update tasks', async () => {
        const tenant = await TestFactories.tenant().create();
        const manager = await TestFactories.user().state({ role: UserRole.MANAGER, tenantId: tenant.id }).create();
        const viewer = await TestFactories.user().state({ role: UserRole.VIEWER, tenantId: tenant.id }).createAuthenticatedUser();
        const task = await TestFactories.task().state({ tenantId: tenant.id, userId: manager.id }).create();

        await request(app.getHttpServer())
            .put(route(task.id))
            .send({ title: 'updated' })
            .set('Cookie', `access_token=${viewer.auth.accessToken}`)
            .expect(403)

        const found = await prisma.task.findUnique({ where: { id: task.id } });
        expect(found?.title).toBe(task.title);
    })
})
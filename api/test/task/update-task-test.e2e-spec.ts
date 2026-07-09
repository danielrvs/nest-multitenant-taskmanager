import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import { INestApplication } from "@nestjs/common"
import { cleanupDatabase } from "../helpers/clean-up-database.helper";
import { AppModule } from "@/app.module";
import { Test } from "@nestjs/testing";
import { setupTestApp } from "../helpers/setup-test.helper";
import { TestFactories } from "../factories/test-factories";
import { UserRole } from "@/modules/users/domain/entities/enums/user-role.enum";
import request from 'supertest';
import { TaskPriority, TaskStatus } from "generated/prisma/enums";

describe('Task Update Test', () => {
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

    const route = (id: string) => (`/tasks/${id}`)

    it('should let update tasks', async () => {
        const tenant = await TestFactories.tenant().create();
        const admin = await TestFactories.user().state({ role: UserRole.ADMIN, tenantId: tenant.id }).createAuthenticatedUser();
        const task = await TestFactories.task().state({ tenantId: tenant.id }).create();
        const anotherUserFromTenant = await TestFactories.user().state({ role: UserRole.VIEWER, tenantId: tenant.id }).create();

        const dueDate = new Date();

        const response = await request(app.getHttpServer())
            .put(route(task.id))
            .set('Cookie', `access_token=${admin.auth.accessToken}`)
            .send({
                title: 'New title',
                description: 'New description',
                status: TaskStatus.IN_PROGRESS,
                priority: TaskPriority.HIGH,
                dueDate,
                assignedTo: anotherUserFromTenant.id,
            })

        expect(response.status).toBe(204)

        const found = await prisma.task.findUnique({ where: { id: task.id } });
        expect(found).toBeDefined();
        expect(found?.title).toBe('New title');
        expect(found?.description).toBe('New description');
        expect(found?.status).toBe(TaskStatus.IN_PROGRESS);
        expect(found?.priority).toBe(TaskPriority.HIGH);
        expect(found?.dueDate).toEqual(dueDate);
        expect(found?.assignedTo).toBe(anotherUserFromTenant.id);
    })

    it('should let update tasks partially', async () => {
        const tenant = await TestFactories.tenant().create();
        const admin = await TestFactories.user().state({ role: UserRole.ADMIN, tenantId: tenant.id }).createAuthenticatedUser();
        const task = await TestFactories.task().state({ tenantId: tenant.id }).create();
        const anotherUserFromTenant = await TestFactories.user().state({ role: UserRole.VIEWER, tenantId: tenant.id }).create();

        const response = await request(app.getHttpServer())
            .put(route(task.id))
            .set('Cookie', `access_token=${admin.auth.accessToken}`)
            .send({
                title: 'New title',
            })
            .expect(204)

        const found = await prisma.task.findUnique({ where: { id: task.id } });
        expect(found?.title).toBe('New title');
    })
})
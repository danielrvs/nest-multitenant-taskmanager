import { TaskRepositoryPort } from "@/modules/tasks/domain/ports/task.repository.port";
import { BaseFactory } from "../base.factory";
import { Task } from "@/modules/tasks/domain/entities/task.entity";
import { TenantRepositoryPort } from "@/modules/tenants/domain/ports/tenant.repository.port";
import { faker } from "@faker-js/faker";
import { randomUUID } from "crypto";
import { UserRepositoryPort } from "@/modules/users/domain/ports/user.repository.port";
import { TaskStatus } from "@/modules/tasks/domain/entities/enums/task-status.enum";
import { TaskPriority } from "@/modules/tasks/domain/entities/enums/task-priority.enum";
import { TestFactories } from "../test-factories";

type TaskStateOverride = {
    id?: string;
    tenantId?: string;
    userId?: string;
    title?: string;
    description?: string | null;
    status?: TaskStatus;
    taskPriority?: TaskPriority;
    dueDate?: Date | null;
    assignedTo?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export class TaskFactoryBuilder extends BaseFactory<TaskStateOverride, Task> {
    constructor(protected readonly repository: TaskRepositoryPort,
        protected readonly tenantRepository: TenantRepositoryPort,
        protected readonly userRepository: UserRepositoryPort,

    ) {
        super(repository);
    }

    protected async defaultDefinition(): Promise<Required<TaskStateOverride>> {
        let tenant = await this.tenantRepository.findRandom();
        if (!tenant) {
            tenant = await TestFactories.tenant().create();
        }

        let owner = await this.userRepository.findRandomByTenantId(tenant.id);
        if (!owner) {
            owner = await TestFactories.user().state({ tenantId: tenant.id }).create();
        }

        let assigned = await this.userRepository.findRandomByTenantIdWhereIdNotIn(tenant.id, [owner.id]);
        if (!assigned) {
            assigned = await TestFactories.user().state({ tenantId: tenant.id }).create();
        }



        return {
            id: randomUUID(),
            tenantId: tenant.id,
            userId: owner.id,
            title: faker.company.name(),
            description: faker.lorem.sentence(),
            status: faker.helpers.arrayElement(Object.values(TaskStatus)),
            taskPriority: faker.helpers.arrayElement(Object.values(TaskPriority)),
            dueDate: faker.date.future(),
            assignedTo: faker.helpers.arrayElement([null, assigned.id]),
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    }

    public async createEntity(): Promise<Task> {
        const def = { ...(await this.defaultDefinition()), ...this.overrides }
        return new Task(
            def.id,
            def.tenantId,
            def.userId,
            def.title,
            def.description,
            def.status,
            def.taskPriority,
            def.dueDate,
            def.assignedTo,
            def.createdAt,
            def.updatedAt);
    }
}
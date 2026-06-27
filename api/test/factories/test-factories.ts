import { TaskRepositoryPort } from "@/modules/tasks/domain/ports/task.repository.port";
import { TenantRepositoryPort } from "@/modules/tenants/domain/ports/tenant.repository.port";
import { UserRepositoryPort } from "@/modules/users/domain/ports/user.repository.port";
import { INestApplication } from "@nestjs/common";
import { UserFactoryBuilder } from "./user/user.factory";
import { TenantFactoryBuilder } from "./tenant/tenant.factory";
import { TaskFactoryBuilder } from "./task/task.factory";

export class TestFactories {
    private static app: INestApplication;

    private static userRepository: UserRepositoryPort | null = null;
    private static tenantRepository: TenantRepositoryPort | null = null;
    private static taskRepository: TaskRepositoryPort | null = null;

    static init(app: INestApplication): typeof TestFactories {
        this.app = app;

        this.userRepository = app.get(UserRepositoryPort);
        this.tenantRepository = app.get(TenantRepositoryPort);
        this.taskRepository = app.get(TaskRepositoryPort);

        return this;
    }

    static user(): UserFactoryBuilder {
        if (!this.userRepository) {
            throw new Error('TestFactories not initialized');
        }

        return new UserFactoryBuilder(this.userRepository, this.tenantRepository);
    }

    static tenant(): TenantFactoryBuilder {
        if (!this.tenantRepository) {
            throw new Error('TestFactories not initialized');
        }

        return new TenantFactoryBuilder(this.tenantRepository);
    }

    static task(): TaskFactoryBuilder {
        if (!this.taskRepository) {
            throw new Error('TestFactories not initialized');
        }

        return new TaskFactoryBuilder(
            this.taskRepository,
            this.tenantRepository, this.userRepository);
    }
}
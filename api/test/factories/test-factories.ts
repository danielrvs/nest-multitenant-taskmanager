import { INestApplication } from "@nestjs/common";

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

        return new UserFactoryBuilder(this.userRepository, this.app.get(JwtService));
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

        return new TaskFactoryBuilder(this.taskRepository);
    }
}
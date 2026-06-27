import { BaseFactory } from "../base.factory";
import { Tenant } from "@/modules/tenants/domain/entities/tenant.entity";
import { TenantRepositoryPort } from "@/modules/tenants/domain/ports/tenant.repository.port";
import { faker } from "@faker-js/faker";
import { randomUUID } from "crypto";

type TenantStateOverride = {
    id?: string;
    name?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class TenantFactoryBuilder extends BaseFactory<TenantStateOverride, Tenant> {
    constructor(protected readonly repository: TenantRepositoryPort) {
        super(repository);
    }

    protected async defaultDefinition(): Promise<Required<TenantStateOverride>> {
        return {
            id: randomUUID(),
            name: faker.company.name(),
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    }

    public async createEntity(): Promise<Tenant> {
        const def = { ...(await this.defaultDefinition()), ...this.overrides }
        return new Tenant(def.id, def.name, def.createdAt, def.updatedAt);
    }
}
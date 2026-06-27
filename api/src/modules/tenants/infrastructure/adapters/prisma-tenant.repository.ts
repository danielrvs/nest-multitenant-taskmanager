import { PrismaBaseRepository } from "@/shared/infrastructure/adapters/prisma-base.repository";
import { TenantRepositoryPort } from "../../domain/ports/tenant.repository.port";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import { Tenant } from "generated/prisma/browser";

@Injectable()
export class PrismaTenantRepository extends PrismaBaseRepository implements TenantRepositoryPort {
    constructor(
        private readonly prisma: PrismaService
    ) {
        super();
    }

    async create(entity: Tenant): Promise<Tenant> {
        throw new Error("Method not implemented.");
    }
    async createMany(entities: Tenant[]): Promise<{ count: number }> {
        throw new Error("Method not implemented.");
    }
    async findById(id: string): Promise<Tenant | null> {
        throw new Error("Method not implemented.");
    }
    async update(id: string, data: Partial<Tenant>): Promise<Tenant> {
        throw new Error("Method not implemented.");
    }
    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findRandom(): Promise<Tenant | null> {
        throw new Error("Method not implemented.");
    }
}
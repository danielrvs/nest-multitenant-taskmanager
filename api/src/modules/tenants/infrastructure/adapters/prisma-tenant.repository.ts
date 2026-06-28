import { PrismaBaseRepository } from "@/shared/infrastructure/adapters/prisma-base.repository";
import { TenantRepositoryPort } from "../../domain/ports/tenant.repository.port";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import { Tenant } from "generated/prisma/browser";
import { TenantMapper } from "../mappers/tenant.mappert";

@Injectable()
export class PrismaTenantRepository extends PrismaBaseRepository implements TenantRepositoryPort {
    constructor(
        private readonly prisma: PrismaService
    ) {
        super();
    }

    async create(entity: Tenant): Promise<Tenant> {
        return this.handleDbOperation(async () => {
            const res = await this.prisma.tenant.create({
                data: TenantMapper.toCreateInput(entity)
            })
            return TenantMapper.toDomain(res)
        })
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
    async findRandom(): Promise<Tenant | null> { //used in tests factories
        return this.handleDbOperation(async () => {
            const count = await this.prisma.tenant.count();
            if (count === 0) return null;

            const randomIndex = Math.floor(Math.random() * count);

            const tenant = await this.prisma.tenant.findFirst({
                skip: randomIndex,
                take: 1
            });

            return tenant ? TenantMapper.toDomain(tenant) : null;
        })
    }
}
import { Prisma } from "generated/prisma/client";
import { Tenant } from "../../domain/entities/tenant.entity";
import { TenantResDto } from "../../application/dtos/tenant.res.dto";
import { Tenant as PrismaTenant } from "generated/prisma/client";

export class TenantMapper {
    static toDomain(data: PrismaTenant): Tenant {
        return new Tenant(
            data.id,
            data.name,
            data.createdAt,
            data.updatedAt
        )
    }

    static toCreateInput(entity: Tenant): Prisma.TenantCreateInput {
        return {
            id: entity.id,
            name: entity.name,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        }
    }

    static toUpdateInput(data: Partial<Tenant>): Prisma.TenantUpdateInput {
        return {
            name: data.name,
            updatedAt: data.updatedAt
        }
    }

    static toResponse(tenant: Tenant): TenantResDto {
        return {
            id: tenant.id,
            name: tenant.name,
            createdAt: tenant.createdAt.toISOString(),
            updatedAt: tenant.updatedAt.toISOString()
        }
    }
}
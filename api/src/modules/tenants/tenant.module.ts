import { Module } from "@nestjs/common";
import { TenantRepositoryPort } from "./domain/ports/tenant.repository.port";
import { PrismaTenantRepository } from "./infrastructure/adapters/prisma-tenant.repository";

@Module({
    providers: [
        {
            provide: TenantRepositoryPort,
            useClass: PrismaTenantRepository,
        }
    ],
    exports: [
        TenantRepositoryPort,
    ]
})
export class TenantModule { }
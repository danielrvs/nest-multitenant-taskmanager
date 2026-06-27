import { IsFactoryRepository } from "@/shared/domain/interfaces/is-factory.repository.interface";
import { Tenant } from "../entities/tenant.entity";

export abstract class TenantRepositoryPort implements IsFactoryRepository<Tenant> {
    abstract create(entity: Tenant): Promise<Tenant>;
    abstract createMany(entities: Tenant[]): Promise<{ count: number }>;
    abstract findById(id: string): Promise<Tenant | null>;
    abstract update(id: string, data: Partial<Tenant>): Promise<Tenant>;
    abstract delete(id: string): Promise<void>;
    abstract findRandom(): Promise<Tenant | null>;
}
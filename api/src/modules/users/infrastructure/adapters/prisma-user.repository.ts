import { PrismaBaseRepository } from "@/shared/infrastructure/adapters/prisma-base.repository";
import { Injectable } from "@nestjs/common";
import { UserRepositoryPort } from "../../domain/ports/user.repository.port";
import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import { User } from "../../domain/entities/user.entity";
import { UserMapper } from "../mappers/user.mapper";

@Injectable()
export class PrismaUserRepository extends PrismaBaseRepository implements UserRepositoryPort {

    constructor(
        private readonly prisma: PrismaService
    ) {
        super();
    }

    async create(entity: User): Promise<User> {
        return this.handleDbOperation(async () => {
            const savedUser = await this.prisma.user.create({
                data: UserMapper.toCreateInput(entity)
            });
            return UserMapper.toDomain(savedUser);
        })
    }
    async createMany(entities: User[]): Promise<{ count: number }> {
        throw new Error("Method not implemented.");
    }
    async findByEmail(email: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
    async update(id: string, data: Partial<User>): Promise<User> {
        throw new Error("Method not implemented.");
    }
    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findByTenantId(tenantId: string): Promise<User[]> {
        throw new Error("Method not implemented.");
    }
}
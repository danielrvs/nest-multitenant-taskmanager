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
        return this.handleDbOperation(async () => {
            const user = await this.prisma.user.findUnique({
                where: {
                    email
                }
            });
            return user ? UserMapper.toDomain(user) : null;
        })
    }

    async findById(id: string): Promise<User | null> {
        return this.handleDbOperation(async () => {
            const user = await this.prisma.user.findUnique({
                where: {
                    id
                }
            });
            return user ? UserMapper.toDomain(user) : null;
        })
    }

    async findByIdWithTenant(id: string): Promise<User | null> {
        return await this.handleDbOperation(async () => {
            const user = await this.prisma.user.findUnique({
                where: {
                    id
                },
                include: {
                    tenant: true
                }
            })

            return user ? UserMapper.toDomain(user) : null;
        })
    }

    async update(id: string, data: User): Promise<User> {
        return await this.handleDbOperation(async () => {
            const updatedUser = await this.prisma.user.update({
                where: {
                    id
                },
                data: UserMapper.toUpdateInput(data)
            })
            return UserMapper.toDomain(updatedUser);
        })
    }
    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findByTenantId(tenantId: string): Promise<User[]> {
        throw new Error("Method not implemented.");
    }

    async findRandomByTenantId(tenantId: string): Promise<User | null> {
        return this.handleDbOperation(async () => {
            const count = await this.prisma.user.count({
                where: {
                    tenantId
                }
            })

            if (count === 0) return null;

            const randomIndex = Math.floor(Math.random() * count);
            const user = await this.prisma.user.findFirst({
                where: {
                    tenantId
                },
                skip: randomIndex,
                take: 1
            });

            return user ? UserMapper.toDomain(user) : null;
        })
    }
    async findRandomByTenantIdWhereIdNotIn(tenantId: string, excludeIds: string[]): Promise<User | null> {
        return this.handleDbOperation(async () => {
            const count = await this.prisma.user.count({
                where: {
                    tenantId,
                    id: {
                        notIn: excludeIds
                    }
                }
            })

            if (count === 0) return null;

            const randomIndex = Math.floor(Math.random() * count);
            const user = await this.prisma.user.findFirst({
                where: {
                    tenantId,
                    id: {
                        notIn: excludeIds
                    }
                },
                skip: randomIndex,
                take: 1
            });

            return user ? UserMapper.toDomain(user) : null;
        })
    }

}
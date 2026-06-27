import { User } from "../../domain/entities/user.entity";
import { User as PrismaUser, Tenant as PrismaTenant, Task as PrismaTask, TaskAudit as PrismaTaskAudit, Prisma, UserRole as PrismaUserRole } from "generated/prisma/client";
import { Email } from "../../domain/entities/vo/email.vo";
import { PasswordHash } from "../../domain/entities/vo/password-hash.vo";
import { UserRole } from "../../domain/entities/enums/user-role.enum";
import { UserResDto } from "../../application/dtos/user.res.dto";

type UserWithRelations = PrismaUser & {
    tenant?: PrismaTenant
    createdTasks?: PrismaTask[]
    assignedTasks?: PrismaTask[]
    taskAudits?: PrismaTaskAudit[]
}

export class UserMapper {
    static toDomain(prismaUser: UserWithRelations): User {
        return new User(
            prismaUser.id,
            prismaUser.tenantId,
            prismaUser.name,
            Email.create(prismaUser.email),
            PasswordHash.fromHash(prismaUser.password),
            prismaUser.role as UserRole,
            prismaUser.mfaSecret,
            prismaUser.mfaRecoveryCodes,
            prismaUser.mfaFactorConfirmedAt,
            prismaUser.createdAt,
            prismaUser.updatedAt
        );
    }

    static toCreateInput(user: User): Prisma.UserCreateInput {
        return {
            id: user.id ?? undefined,
            tenant: {
                connect: {
                    id: user.tenantId
                }
            },
            name: user.name,
            email: user.email.toString(),
            password: user.password.toString(),
            role: user.role as unknown as PrismaUserRole,
        };
    }

    static toUpdateInput(user: User): Prisma.UserUpdateInput {
        return {
            name: user.name,
            email: user.email.toString(),
            password: user.password.toString() ?? undefined,
            role: user.role as unknown as PrismaUserRole,
            mfaSecret: user.mfaSecret,
            mfaRecoveryCodes: user.mfaRecoveryCodes,
            mfaFactorConfirmedAt: user.mfaFactorConfirmedAt
        };
    }

    static toResponse(user: User): UserResDto {
        return {
            id: user.id,
            tenantId: user.tenantId,
            name: user.name,
            email: user.email.toString(),
            role: user.role,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString()
        };
    }
}
import { User } from "../../domain/entities/user.entity";
import { User as PrismaUser, Tenant as PrismaTenant, Task as PrismaTask, TaskAudit as PrismaTaskAudit, Prisma, UserRole as PrismaUserRole, RefreshToken as PrismaRefreshToken, MfaBackupCodes as PrismaMfaBackupCodes } from "generated/prisma/client";
import { Email } from "../../domain/entities/vo/email.vo";
import { PasswordHash } from "../../domain/entities/vo/password-hash.vo";
import { UserRole } from "../../domain/entities/enums/user-role.enum";
import { UserResDto } from "../../application/dtos/user.res.dto";
import { TenantMapper } from "@/modules/tenants/infrastructure/mappers/tenant.mappert";
import { TaskMapper } from "@/modules/tasks/infrastructure/mappers/task.mapper";
import { TaskAuditMapper } from "@/modules/tasks/infrastructure/mappers/task-audit.mapper";
import { RefreshTokenMapper } from "@/modules/auth/infrastructure/mappers/refresh-token.mapper";
import { MfaBackupCodesMapper } from "@/modules/auth/infrastructure/mappers/mfa-backup-codes.mapper";

type UserWithRelations = PrismaUser & {
    tenant?: PrismaTenant
    createdTasks?: PrismaTask[]
    assignedTasks?: PrismaTask[]
    taskAudits?: PrismaTaskAudit[]
    refreshTokens?: PrismaRefreshToken[]
    mfaBackupCodes?: PrismaMfaBackupCodes[]
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
            prismaUser.mfaFactorConfirmedAt,
            prismaUser.createdAt,
            prismaUser.updatedAt,
            prismaUser.tenant ? TenantMapper.toDomain(prismaUser.tenant) : null,
            prismaUser.createdTasks ? prismaUser.createdTasks.map((task) => TaskMapper.toDomain(task)) : null,
            prismaUser.assignedTasks ? prismaUser.assignedTasks.map((task) => TaskMapper.toDomain(task)) : null,
            prismaUser.taskAudits ? prismaUser.taskAudits.map((audit) => TaskAuditMapper.toDomain(audit)) : null,
            prismaUser.refreshTokens ? prismaUser.refreshTokens.map((token) => RefreshTokenMapper.toDomain(token)) : null,
            prismaUser.mfaBackupCodes ? prismaUser.mfaBackupCodes.map((code) => MfaBackupCodesMapper.toDomain(code)) : null
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
            mfaSecret: user.mfaSecret,
            mfaFactorConfirmedAt: user.mfaFactorConfirmedAt,
            role: user.role as PrismaUserRole,
        };
    }

    static toCreateManyInput(user: User): Prisma.UserCreateManyInput {
        return {
            id: user.id ?? undefined,
            tenantId: user.tenantId,
            name: user.name,
            email: user.email.toString(),
            password: user.password.toString(),
            mfaSecret: user.mfaSecret,
            mfaFactorConfirmedAt: user.mfaFactorConfirmedAt,
            role: user.role as PrismaUserRole
        }
    }

    static toUpdateInput(user: User): Prisma.UserUpdateInput {
        return {
            name: user.name,
            email: user.email.toString(),
            password: user.password.toString(),
            role: user.role as PrismaUserRole,
            mfaSecret: user.mfaSecret,
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
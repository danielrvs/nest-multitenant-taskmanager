import { TenantMapper } from "@/modules/tenants/infrastructure/mappers/tenant.mappert";
import { TaskPriority } from "../../domain/entities/enums/task-priority.enum";
import { TaskStatus } from "../../domain/entities/enums/task-status.enum";
import { Task } from "../../domain/entities/task.entity";
import {
    Prisma,
    Task as PrismaTask,
    TaskPriority as PrismaTaskPriority,
    TaskStatus as PrismaTaskStatus,
    Tenant as PrismaTenant,
    User as PrismaUser,
    TaskAudit as PrismaTaskAudit,
} from "generated/prisma/client";
import { UserMapper } from "@/modules/users/infrastructure/mappers/user.mapper";
import { TaskAuditMapper } from "./task-audit.mapper";

type TaskWithRelations = PrismaTask & {
    tenant?: PrismaTenant
    creator?: PrismaUser
    assignee?: PrismaUser
    audits?: PrismaTaskAudit[]
}

export class TaskMapper {
    static toDomain(prismaTask: TaskWithRelations): Task {
        return new Task(
            prismaTask.id,
            prismaTask.tenantId,
            prismaTask.userId,
            prismaTask.title,
            prismaTask.description,
            prismaTask.status as unknown as TaskStatus,
            prismaTask.priority as unknown as TaskPriority,
            prismaTask.dueDate,
            prismaTask.assignedTo,
            prismaTask.createdAt,
            prismaTask.updatedAt,

            prismaTask.tenant ? TenantMapper.toDomain(prismaTask.tenant) : null,
            prismaTask.creator ? UserMapper.toDomain(prismaTask.creator) : null,
            prismaTask.assignee ? UserMapper.toDomain(prismaTask.assignee) : null,
            prismaTask.audits ? prismaTask.audits.map(TaskAuditMapper.toDomain) : null
        );
    }

    static toCreateInput(entity: Task): Prisma.TaskCreateInput {
        return {
            id: entity.id,
            tenant: { connect: { id: entity.tenantId } },
            creator: { connect: { id: entity.userId } },
            title: entity.title,
            description: entity.description,
            status: entity.status as unknown as PrismaTaskStatus,
            priority: entity.priority as unknown as PrismaTaskPriority,
            dueDate: entity.dueDate,
            assignee: entity.assignedTo ? { connect: { id: entity.assignedTo } } : undefined,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }

    static toCreateManyInput(entity: Task): Prisma.TaskCreateManyInput {
        return {
            id: entity.id,
            tenantId: entity.tenantId,
            userId: entity.userId,
            title: entity.title,
            description: entity.description,
            status: entity.status as unknown as PrismaTaskStatus,
            priority: entity.priority as unknown as PrismaTaskPriority,
            dueDate: entity.dueDate,
            assignedTo: entity.assignedTo,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }

    static toUpdateInput(data: Partial<Task>): Prisma.TaskUpdateInput {
        return {
            title: data.title,
            description: data.description,
            status: data.status as unknown as PrismaTaskStatus,
            priority: data.priority as unknown as PrismaTaskPriority,
            dueDate: data.dueDate,
            assignee: { connect: { id: data.assignedTo } },
            updatedAt: data.updatedAt
        };
    }
}
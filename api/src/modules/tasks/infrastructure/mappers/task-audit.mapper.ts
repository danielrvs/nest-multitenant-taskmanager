import { Prisma, TaskAudit as PrismaTaskAudit, Task as PrismaTask, User as PrismaUser } from "generated/prisma/client";
import { TaskAudit } from "@/modules/tasks/domain/entities/task-audit.entity";
import { TaskMapper } from "./task.mapper";
import { UserMapper } from "@/modules/users/infrastructure/mappers/user.mapper";


type TaskAuditWithRelations = PrismaTaskAudit & {
    task?: PrismaTask,
    user?: PrismaUser
}

export class TaskAuditMapper {
    static toDomain(prismaTaskAudit: TaskAuditWithRelations): TaskAudit {
        return new TaskAudit(
            prismaTaskAudit.id,
            prismaTaskAudit.taskId,
            prismaTaskAudit.userId,
            prismaTaskAudit.action,
            prismaTaskAudit.createdAt,

            prismaTaskAudit.user ? UserMapper.toDomain(prismaTaskAudit.user) : null,
            prismaTaskAudit.task ? TaskMapper.toDomain(prismaTaskAudit.task) : null,
        );
    }

    static toCreateInput(entity: TaskAudit): Prisma.TaskAuditCreateInput {
        return {
            id: entity.id,
            task: { connect: { id: entity.taskId } },
            user: { connect: { id: entity.userId } },
            action: entity.action,
            createdAt: entity.createdAt,
        };
    }

    static toUpdateInput(entity: Partial<TaskAudit>): Prisma.TaskAuditUpdateInput {
        return {
            task: { connect: { id: entity.taskId } },
            user: { connect: { id: entity.userId } },
            action: entity.action,
            createdAt: entity.createdAt,
        };
    }
}
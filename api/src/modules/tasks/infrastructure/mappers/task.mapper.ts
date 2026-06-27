import { TaskPriority } from "../../domain/entities/enums/task-priority.enum";
import { TaskStatus } from "../../domain/entities/enums/task-status.enum";
import { Task } from "../../domain/entities/task.entity";
import { Prisma, Task as PrismaTask, TaskPriority as PrismaTaskPriority, TaskStatus as PrismaTaskStatus } from "generated/prisma/client";

export class TaskMapper {
    static toDomain(prismaTask: PrismaTask): Task {
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
            prismaTask.updatedAt
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
            assignee: { connect: { id: entity.assignedTo } },
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
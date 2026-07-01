import { randomUUID } from "crypto";
import { Task } from "./task.entity";
import { User } from "@/modules/users/domain/entities/user.entity";

export class TaskAudit {
    constructor(
        public readonly id: string,
        public readonly taskId: string,
        public readonly userId: string,
        public readonly action: string,
        public readonly createdAt: Date,

        public readonly user: User,
        public readonly task: Task
    ) {

    }

    public static async create(data: {
        taskId: string,
        userId: string,
        action: string,
    }): Promise<TaskAudit> {
        return new TaskAudit(
            randomUUID(),
            data.taskId,
            data.userId,
            data.action,
            new Date(),
            null,
            null
        );
    }
}
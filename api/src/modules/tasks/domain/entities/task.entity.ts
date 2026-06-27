import { randomUUID } from "crypto";
import { TaskPriority } from "./enums/task-priority.enum";
import { TaskStatus } from "./enums/task-status.enum";

export class Task {
    constructor(
        public readonly id: string,
        public readonly tenantId: string,
        public readonly userId: string,
        public readonly title: string,
        public readonly description: string | null,
        public readonly status: TaskStatus,
        public readonly priority: TaskPriority,
        public readonly dueDate: Date | null,
        public readonly assignedTo: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }

    static async create(data: {
        tenantId: string,
        userId: string,
        title: string,
        description: string | null,
        status: TaskStatus,
        priority: TaskPriority,
        dueDate: Date | null,
        assignedTo: string | null,
    }) {
        const now = new Date();
        return new Task(
            randomUUID(),
            data.tenantId,
            data.userId,
            data.title,
            data.description,
            data.status,
            data.priority,
            data.dueDate,
            data.assignedTo,
            now,
            now
        );
    }
}
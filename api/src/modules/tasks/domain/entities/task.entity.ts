import { randomUUID } from "crypto";
import { TaskPriority } from "./enums/task-priority.enum";
import { TaskStatus } from "./enums/task-status.enum";
import { Tenant } from "@/modules/tenants/domain/entities/tenant.entity";
import { User } from "@/modules/users/domain/entities/user.entity";
import { TaskAudit } from "./task-audit.entity";

export class Task {
    constructor(
        public readonly id: string,
        public readonly tenantId: string,
        public readonly userId: string,
        public title: string,
        public description: string | null,
        public status: TaskStatus,
        public priority: TaskPriority,
        public dueDate: Date | null,
        public assignedTo: string | null,
        public readonly createdAt: Date,
        public updatedAt: Date,

        public readonly tenant: Tenant | null = null,
        public readonly creator: User | null = null,
        public readonly assignee: User | null = null,
        public readonly audits: TaskAudit[] | null = null,
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

    update(data: {
        title?: string;
        description?: string | null;
        status?: TaskStatus;
        priority?: TaskPriority;
        dueDate?: Date | null;
        assignedTo?: string | null;
    }) {
        if (data.title !== undefined) this.title = data.title;
        if (data.description !== undefined) this.description = data.description;
        if (data.status !== undefined) this.status = data.status;
        if (data.priority !== undefined) this.priority = data.priority;
        if (data.dueDate !== undefined) this.dueDate = data.dueDate;
        if (data.assignedTo !== undefined) this.assignedTo = data.assignedTo;
        this.updatedAt = new Date();
    }
}
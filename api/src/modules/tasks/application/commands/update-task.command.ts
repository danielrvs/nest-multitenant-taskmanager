import { Authenticated } from "@/modules/auth/domain/interfaces/authenticated.interface";
import { TaskPriority } from "../../domain/entities/enums/task-priority.enum";
import { TaskStatus } from "../../domain/entities/enums/task-status.enum";

export class UpdateTaskCommand {
    constructor(
        public readonly currentUser: Authenticated,
        public readonly id: string,
        public readonly title?: string,
        public readonly description?: string,
        public readonly status?: TaskStatus,
        public readonly priority?: TaskPriority,
        public readonly dueDate?: Date,
        public readonly assignedTo?: string,
    ) { }
}

import { TaskPriority } from "../../domain/entities/enums/task-priority.enum";
import { TaskStatus } from "../../domain/entities/enums/task-status.enum";
import { Task } from "../../domain/entities/task.entity";
import { ApiProperty } from "@nestjs/swagger";


// NOTE: Because is over-engineering to create a response DTO for infrastructure
// and another for application (pure hexagonal) in a demo project, I created only one
export class UpdateTaskResDTO {
    @ApiProperty({
        example: 'task-id-123',
        description: 'Task ID',
    })
    id: string;

    @ApiProperty({
        example: 'Task Title',
        description: 'Task Title',
    })
    title: string;

    @ApiProperty({
        example: 'Task Description',
        description: 'Task Description',
    })
    description: string | null;

    @ApiProperty({
        enum: TaskStatus,
        example: TaskStatus.IN_PROGRESS,
        description: 'Task Status',
    })
    status: TaskStatus;

    @ApiProperty({
        enum: TaskPriority,
        example: TaskPriority.HIGH,
        description: 'Task Priority',
    })
    priority: TaskPriority;

    @ApiProperty({
        example: '2024-12-31',
        description: 'Task Due Date',
    })
    dueDate: Date | null;

    @ApiProperty({
        example: 'user-id-123',
        description: 'Task Assigned To',
    })
    assignedTo: string | null;

    @ApiProperty({
        example: '2024-12-31',
        description: 'Task Updated At',
    })
    updatedAt: Date;

    constructor(
        id: string,
        title: string,
        description: string | null,
        status: TaskStatus,
        priority: TaskPriority,
        dueDate: Date | null,
        assignedTo: string | null,
        updatedAt: Date
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;
        this.assignedTo = assignedTo;
        this.updatedAt = updatedAt;
    }

    static fromEntity(entity: Task): UpdateTaskResDTO {
        return new UpdateTaskResDTO(
            entity.id,
            entity.title,
            entity.description,
            entity.status,
            entity.priority,
            entity.dueDate,
            entity.assignedTo,
            entity.updatedAt
        );
    }
}
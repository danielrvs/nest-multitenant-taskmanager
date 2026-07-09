import { ApiProperty } from "@nestjs/swagger";
import { TaskPriority } from "../../domain/entities/enums/task-priority.enum";
import { TaskStatus } from "../../domain/entities/enums/task-status.enum";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateTaskReqDTO {
    @ApiProperty({ example: 'Task Title', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 'Task Description', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS, required: false })
    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;

    @ApiProperty({ enum: TaskPriority, example: TaskPriority.HIGH, required: false })
    @IsEnum(TaskPriority)
    @IsOptional()
    priority?: TaskPriority;

    @ApiProperty({ example: '2024-12-31', required: false })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    dueDate?: Date;

    @ApiProperty({ example: 'user-id-123', required: false })
    @IsString()
    @IsOptional()
    assignedTo?: string;
}
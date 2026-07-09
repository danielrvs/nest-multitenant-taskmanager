import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateTaskCommand } from "../commands/update-task.command";
import { TaskRepositoryPort } from "../../domain/ports/task.repository.port";
import { NotFoundException } from "@nestjs/common";
import { UpdateTaskResDTO } from "../dtos/update-task.res.dto";

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand, UpdateTaskResDTO> {
    constructor(
        private readonly repository: TaskRepositoryPort
    ) { }

    async execute(command: UpdateTaskCommand): Promise<UpdateTaskResDTO> {
        const task = await this.repository.findById(command.id);
        if (!task) {
            throw new NotFoundException('Task not found');
        }

        //NOTE: to avoid over enginering I created a unique update method
        //instead of creating a method for each field (like updateTitle, updateDescription, etc).
        //This is a trade-off between code simplicity and explicitness for a demo project
        task.update({
            title: command.title,
            description: command.description,
            status: command.status,
            priority: command.priority,
            dueDate: command.dueDate,
            assignedTo: command.assignedTo
        })

        const res = await this.repository.update(task.id, task);
        return UpdateTaskResDTO.fromEntity(res);
    }
}
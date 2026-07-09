import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteTaskCommand } from "../commands/delete-task.command";
import { TaskRepositoryPort } from "../../domain/ports/task.repository.port";
import { NotFoundException } from "@nestjs/common";
import { TaskPolicy } from "../../domain/policies/task.policy";

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand, void> {
    constructor(
        private readonly repository: TaskRepositoryPort
    ) {}

    async execute(command: DeleteTaskCommand): Promise<void> {
        const task = await this.repository.findById(command.id);

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        TaskPolicy.isUserAuthorizedToDelete(command.currentUser, task);

        await this.repository.delete(command.id);
    }
}

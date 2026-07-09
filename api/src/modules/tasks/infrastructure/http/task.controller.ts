import { ResponseMessage } from "@/shared/infrastructure/decorators/response-message.decorator";
import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Put } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { UpdateTaskCommand } from "../../application/commands/update-task.command";
import { DeleteTaskCommand } from "../../application/commands/delete-task.command";
import { UpdateTaskReqDTO } from "../../application/dtos/update-task.req.dto";
import { CurrentUser } from "@/shared/infrastructure/decorators/current-user.decorator";
import { Authenticated } from "@/modules/auth/domain/interfaces/authenticated.interface";

@Controller('tasks')
export class TaskController {
    constructor(
        private readonly commandBus: CommandBus,
    ) { }
    @Put(':id')
    @ResponseMessage('Task updated successfully')
    @HttpCode(HttpStatus.NO_CONTENT)
    async update(@CurrentUser() user: Authenticated, @Body() dto: UpdateTaskReqDTO, @Param('id') id: string) {
        const command = new UpdateTaskCommand(user, id, dto.title, dto.description, dto.status, dto.priority, dto.dueDate, dto.assignedTo);
        return await this.commandBus.execute(command);
    }

    @Delete(':id')
    @ResponseMessage('Task deleted successfully')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@CurrentUser() user: Authenticated, @Param('id') id: string) {
        const command = new DeleteTaskCommand(user, id);
        return await this.commandBus.execute(command);
    }
}
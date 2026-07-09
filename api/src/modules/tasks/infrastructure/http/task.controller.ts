import { ResponseMessage } from "@/shared/infrastructure/decorators/response-message.decorator";
import { Body, Controller, HttpCode, HttpStatus, Param, Put } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { UpdateTaskCommand } from "../../application/commands/update-task.command";
import { UpdateTaskReqDTO } from "../../application/dtos/update-task.req.dto";

@Controller('tasks')
export class TaskController {
    constructor(
        private readonly commandBus: CommandBus,
    ) { }
    @Put(':id')
    @ResponseMessage('Task updated successfully')
    @HttpCode(HttpStatus.NO_CONTENT)
    async update(@Body() dto: UpdateTaskReqDTO, @Param('id') id: string) {
        const command = new UpdateTaskCommand(id, dto.title, dto.description, dto.status, dto.priority, dto.dueDate, dto.assignedTo);
        return await this.commandBus.execute(command);
    }
}
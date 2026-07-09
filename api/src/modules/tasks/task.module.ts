import { Module } from "@nestjs/common";
import { TaskRepositoryPort } from "./domain/ports/task.repository.port";
import { PrismaTaskRepository } from "./infrastructure/adapters/prisma-task.repository";
import { UpdateTaskHandler } from "./application/handlers/update-task.handler";
import { TaskController } from "./infrastructure/http/task.controller";
import { CqrsModule } from "@nestjs/cqrs";


const CommandHandler = [UpdateTaskHandler];

@Module({
    imports: [
        CqrsModule
    ],
    providers: [
        ...CommandHandler,
        {
            provide: TaskRepositoryPort,
            useClass: PrismaTaskRepository,
        }
    ],
    exports: [
        TaskRepositoryPort,
    ],
    controllers: [
        TaskController
    ]
})
export class TaskModule { }
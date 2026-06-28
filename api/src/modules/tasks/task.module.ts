import { Module } from "@nestjs/common";
import { TaskRepositoryPort } from "./domain/ports/task.repository.port";
import { PrismaTaskRepository } from "./infrastructure/adapters/prisma-task.repository";

@Module({
    providers: [
        {
            provide: TaskRepositoryPort,
            useClass: PrismaTaskRepository,
        }
    ],
    exports: [
        TaskRepositoryPort,
    ]
})
export class TaskModule { }
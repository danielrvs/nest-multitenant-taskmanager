import { PrismaBaseRepository } from "@/shared/infrastructure/adapters/prisma-base.repository";
import { TaskRepositoryPort } from "../../domain/ports/task.repository.port";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import { Task } from "../../domain/entities/task.entity";

@Injectable()
export class PrismaTaskRepository extends PrismaBaseRepository implements TaskRepositoryPort {
    constructor(
        private readonly prisma: PrismaService
    ) {
        super();
    }

    create(entity: Task): Promise<Task> {
        throw new Error("Method not implemented.");
    }

    createMany(entities: Task[]): Promise<{ count: number }> {
        throw new Error("Method not implemented.");
    }

    findById(id: string): Promise<Task | null> {
        throw new Error("Method not implemented.");
    }

    findByUserId(userId: string): Promise<Task[]> {
        throw new Error("Method not implemented.");
    }

    findByTenantId(tenantId: string): Promise<Task[]> {
        throw new Error("Method not implemented.");
    }

    findByAssignedTo(assignedToId: string): Promise<Task[]> {
        throw new Error("Method not implemented.");
    }

    update(id: string, data: Partial<Task>): Promise<Task> {
        throw new Error("Method not implemented.");
    }

    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }


}
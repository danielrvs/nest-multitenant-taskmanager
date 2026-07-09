import { PrismaBaseRepository } from "@/shared/infrastructure/adapters/prisma-base.repository";
import { TaskRepositoryPort } from "../../domain/ports/task.repository.port";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";
import { Task } from "../../domain/entities/task.entity";
import { TaskMapper } from "../mappers/task.mapper";

@Injectable()
export class PrismaTaskRepository extends PrismaBaseRepository implements TaskRepositoryPort {
    constructor(
        private readonly prisma: PrismaService
    ) {
        super();
    }

    async create(entity: Task): Promise<Task> {
        return await this.handleDbOperation(async () => {
            const res = await this.prisma.task.create({ data: TaskMapper.toCreateInput(entity) });
            return TaskMapper.toDomain(res);
        })

    }

    async createMany(entities: Task[]): Promise<{ count: number }> {
        return await this.handleDbOperation(async () => {
            const res = await this.prisma.task.createMany({ data: entities.map(TaskMapper.toCreateManyInput) });
            return res;
        })
    }

    async findById(id: string): Promise<Task | null> {
        return await this.handleDbOperation(async () => {
            const res = await this.prisma.task.findUnique({ where: { id } });
            if (!res) return null;
            return TaskMapper.toDomain(res);
        })
    }

    async findByUserId(userId: string): Promise<Task[]> {
        return await this.handleDbOperation(async () => {
            const res = await this.prisma.task.findMany({ where: { userId } });
            return res.map(TaskMapper.toDomain);
        })
    }

    async findByTenantId(tenantId: string): Promise<Task[]> {
        return await this.handleDbOperation(async () => {
            const res = await this.prisma.task.findMany({ where: { tenantId } });
            return res.map(TaskMapper.toDomain);
        })
    }

    async findByAssignedTo(assignedToId: string): Promise<Task[]> {
        return await this.handleDbOperation(async () => {
            const res = await this.prisma.task.findMany({ where: { assignedTo: assignedToId } });
            return res.map(TaskMapper.toDomain);
        })
    }

    async update(id: string, data: Partial<Task>): Promise<Task> {
        return await this.handleDbOperation(async () => {
            const res = await this.prisma.task.update({ where: { id }, data: TaskMapper.toUpdateInput(data) });
            return TaskMapper.toDomain(res);
        })
    }

    async delete(id: string): Promise<void> {
        return await this.handleDbOperation(async () => {
            await this.prisma.task.delete({ where: { id } });
        })
    }


}
import { IsFactoryRepository } from "@/shared/domain/interfaces/is-factory.repository.interface";
import { Task } from "../entities/task.entity";

export abstract class TaskRepositoryPort implements IsFactoryRepository<Task> {
    abstract create(task: Task): Promise<Task>;
    abstract createMany(tasks: Task[]): Promise<{ count: number }>;
    abstract findById(id: string): Promise<Task | null>;
    abstract findByUserId(userId: string): Promise<Task[]>;
    abstract findByTenantId(tenantId: string): Promise<Task[]>;
    abstract findByAssignedTo(assignedToId: string): Promise<Task[]>;
    abstract update(id: string, data: Partial<Task>): Promise<Task>;
    abstract delete(id: string): Promise<void>;
}

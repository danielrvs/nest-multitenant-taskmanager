import { PrismaBaseRepository } from "@/shared/infrastructure/adapters/prisma-base.repository";
import { RefreshTokenRepositoryPort } from "../../domain/ports/refresh-token.repository.port";
import { RefreshToken } from "../../domain/entities/refresh-token.entity";

export class PrismaRefreshTokenRepository extends PrismaBaseRepository implements RefreshTokenRepositoryPort {
    async create(entity: RefreshToken): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findByToken(token: string): Promise<RefreshToken | null> {
        throw new Error("Method not implemented.");
    }
    async delete(token: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async deleteAllByUserId(userId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}
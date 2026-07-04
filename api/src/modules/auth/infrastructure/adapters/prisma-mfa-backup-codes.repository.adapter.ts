import { PrismaBaseRepository } from "@/shared/infrastructure/adapters/prisma-base.repository";
import { MfaBackupCodesRepositoryPort } from "../../domain/ports/mfa-backup-codes.repository.port";
import { Injectable } from "@nestjs/common";
import { MfaBackupCodes } from "../../domain/entities/mfa-backup-codes.entity";
import { MfaBackupCodesMapper } from "../mappers/mfa-backup-codes.mapper";
import { PrismaService } from "@/shared/infrastructure/prisma/prisma.service";

@Injectable()
export class PrismaMfaBackupCodesRepository extends PrismaBaseRepository implements MfaBackupCodesRepositoryPort {

    constructor(public readonly prisma: PrismaService) { super() }

    async create(data: MfaBackupCodes): Promise<MfaBackupCodes> {
        throw new Error("Method not implemented.");
    }

    async createMany(data: MfaBackupCodes[]): Promise<{ count: number }> {
        throw new Error("Method not implemented.");
    }

    async findByCode(code: string): Promise<MfaBackupCodes | null> {
        throw new Error("Method not implemented.");
    }

    async findByUserId(userId: string): Promise<MfaBackupCodes[] | null> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: Partial<MfaBackupCodes>): Promise<MfaBackupCodes> {
        throw new Error("Method not implemented.");
    }
}
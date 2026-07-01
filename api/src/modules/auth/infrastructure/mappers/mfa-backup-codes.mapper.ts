import { MfaBackupCodes } from "../../domain/entities/mfa-backup-codes.entity";
import { MfaBackupCodes as PrismaMfaBackupCodes, Prisma, User as PrismaUser } from "generated/prisma/client";
import { UserMapper } from "@/modules/users/infrastructure/mappers/user.mapper";

type MfaBackupCodesWithRelations = PrismaMfaBackupCodes & {
    user?: PrismaUser;
};

export class MfaBackupCodesMapper {
    constructor() {

    }

    static toDomain(data: MfaBackupCodesWithRelations): MfaBackupCodes {
        return new MfaBackupCodes(
            data.id,
            data.userId,
            data.code,
            data.used,
            data.createdAt,
            data.updatedAt,
            data.user ? UserMapper.toDomain(data.user) : null
        );
    }

    static toCreateInput(entity: MfaBackupCodes): Prisma.MfaBackupCodesCreateInput {
        return {
            id: entity.id,
            user: { connect: { id: entity.userId } },
            code: entity.code,
            used: entity.used,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    static toUpdateInput(entity: Partial<MfaBackupCodes>): Prisma.MfaBackupCodesUpdateInput {
        return {
            used: entity.used
        }
    }
}
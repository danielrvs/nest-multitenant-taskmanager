import { User } from "@/modules/users/domain/entities/user.entity";
import { randomUUID } from "crypto";

export class MfaBackupCodes {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly code: string,
        public readonly used: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,

        public readonly user: User
    ) {

    }

    static async create(data: {
        userId: string,
        code: string,
    }): Promise<MfaBackupCodes> {
        return new MfaBackupCodes(
            randomUUID(),
            data.userId,
            data.code,
            false,
            new Date(),
            new Date(),
            null
        );
    }
}
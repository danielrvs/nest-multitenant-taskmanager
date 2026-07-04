import { User } from "@/modules/users/domain/entities/user.entity";
import { randomUUID, randomBytes } from "crypto";

export class MfaBackupCodes {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly code: string,
        public used: boolean,
        public readonly createdAt: Date,
        public updatedAt: Date,

        public readonly user: User | null = null
    ) {

    }

    static create(data: {
        userId: string,
    }): MfaBackupCodes {
        const code = MfaBackupCodes.generateCode();
        return new MfaBackupCodes(
            randomUUID(),
            data.userId,
            code,
            false,
            new Date(),
            new Date()
        );
    }

    static generateCode(): string {
        return randomBytes(5).toString("hex").toUpperCase();
    }

    use(): void {
        if (this.used) {
            throw new Error('Code already used');
        }
        this.used = true;
        this.updatedAt = new Date();
    }
}
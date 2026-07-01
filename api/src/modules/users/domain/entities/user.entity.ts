import { randomUUID } from "crypto";
import { UserRole } from "./enums/user-role.enum";
import { Email } from "./vo/email.vo";
import { PasswordHash } from "./vo/password-hash.vo";
import { Tenant } from "@/modules/tenants/domain/entities/tenant.entity";
import { Task } from "@/modules/tasks/domain/entities/task.entity";
import { TaskAudit } from "@/modules/tasks/domain/entities/task-audit.entity";
import { RefreshToken } from "@/modules/auth/domain/entities/refresh-token.entity";
import { MfaBackupCodes } from "@/modules/auth/domain/entities/mfa-backup-codes.entity";

export class User {
    constructor(
        public readonly id: string,
        public readonly tenantId: string,
        public readonly name: string,
        public readonly email: Email,
        public readonly password: PasswordHash,
        public readonly role: UserRole,
        public readonly mfaSecret: string | null,
        public readonly mfaRecoveryCodes: string | null,
        public readonly mfaFactorConfirmedAt: Date | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,

        public readonly tenant: Tenant | null = null,
        public readonly createdTasks: Task[] | null = null,
        public readonly assignedTasks: Task[] | null = null,
        public readonly taskAudits: TaskAudit[] | null = null,
        public readonly refreshTokens: RefreshToken[] | null = null,
        public readonly mfaBackupCodes: MfaBackupCodes[] | null = null
    ) {

    }

    static async create(data: {
        tenantId: string,
        name: string,
        email: string,
        password: string,
        role: UserRole
    }): Promise<User> {
        const emailVo = Email.create(data.email);
        const passwordHashVo = await PasswordHash.create(data.password);
        const now = new Date();

        return new User(
            randomUUID(),
            data.tenantId,
            data.name,
            emailVo,
            passwordHashVo,
            data.role,
            null,
            null,
            null,
            now,
            now,
        )
    }

}
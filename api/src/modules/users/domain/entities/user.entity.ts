import { randomBytes, randomUUID } from "crypto";
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
        public name: string,
        public email: Email,
        public password: PasswordHash,
        public passwordResetToken: PasswordHash | null,
        public passwordResetExpiresAt: Date | null,
        public role: UserRole,
        public mfaSecret: string | null,
        public mfaFactorConfirmedAt: Date | null,
        public readonly createdAt: Date,
        public updatedAt: Date,

        public tenant: Tenant | null = null,
        public createdTasks: Task[] | null = null,
        public assignedTasks: Task[] | null = null,
        public taskAudits: TaskAudit[] | null = null,
        public refreshTokens: RefreshToken[] | null = null,
        public mfaBackupCodes: MfaBackupCodes[] | null = null
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
            null,
            null,
            data.role,
            null,
            null,
            now,
            now,
        )
    }

    setMFASecret(secret: string): void {
        this.mfaSecret = secret;
    }

    disableMFA(): void {
        this.mfaSecret = null;
        this.mfaFactorConfirmedAt = null;
    }

    enableMFA(): void {
        this.mfaFactorConfirmedAt = new Date();
    }

    isMFAEnabled(): boolean {
        return this.mfaFactorConfirmedAt !== null && this.mfaSecret !== null;
    }

    async requestPasswordReset(): Promise<string> {
        const token = randomBytes(5).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        this.passwordResetToken = await PasswordHash.create(token);
        this.passwordResetExpiresAt = expiresAt;
        return token;
    }

    async resetPassword(password: string, token: string): Promise<void> {
        if (!this.passwordResetToken || !this.passwordResetExpiresAt) {
            throw new Error('User has no password reset token');
        }

        if (!await this.passwordResetToken.compare(token)) {
            throw new Error('Invalid password reset token');
        }
        if (this.passwordResetExpiresAt < new Date()) {
            throw new Error('Password reset token has expired');
        }

        this.password = await PasswordHash.create(password);
        this.passwordResetToken = null;
        this.passwordResetExpiresAt = null;
    }

}
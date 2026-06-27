import { randomUUID } from "crypto";
import { UserRole } from "./enums/user-role.enum";
import { Email } from "./vo/email.vo";
import { PasswordHash } from "./vo/password-hash.vo";

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
        public readonly updatedAt: Date
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
            now
        )
    }

}
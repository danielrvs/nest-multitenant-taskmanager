import { UserRole } from "@/modules/users/domain/entities/enums/user-role.enum";
import { BaseFactory } from "../base.factory";
import { UserRole as PrismaUserRole } from "generated/prisma/enums";
import { User } from "@/modules/users/domain/entities/user.entity";
import { UserRepositoryPort } from "@/modules/users/domain/ports/user.repository.port";
import { randomUUID } from "crypto";
import { faker } from "@faker-js/faker";
import { TenantRepositoryPort } from "@/modules/tenants/domain/ports/tenant.repository.port";
import { TestFactories } from "../test-factories";
import { Email } from "@/modules/users/domain/entities/vo/email.vo";
import { PasswordHash } from "@/modules/users/domain/entities/vo/password-hash.vo";
import { TokenGeneratorPort, TokenPayload } from "@/modules/auth/domain/ports/token-generator.port";


export type UserStateOverride = {
    id?: string;
    tenantId?: string;
    name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    mfaSecret?: string | null;
    mfaRecoveryCodes?: string | null;
    mfaFactorConfirmedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export type PrismaUserData = {
    id: string;
    tenantId: string;
    name: string;
    email: string;
    role: PrismaUserRole;
    mfaSecret: string | null;
    mfaRecoveryCodes: string | null;
    mfaFactorConfirmedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export class UserFactoryBuilder extends BaseFactory<UserStateOverride, User> {
    constructor(
        protected readonly repository: UserRepositoryPort,
        protected readonly tenantRepository: TenantRepositoryPort,
        protected readonly tokenGenerator: TokenGeneratorPort) {
        super(repository);
    }

    protected async defaultDefinition(): Promise<Required<UserStateOverride>> {
        let tenantId = this.overrides.tenantId ?? (await this.tenantRepository.findRandom())?.id;
        if (!tenantId) {
            tenantId = (await TestFactories.tenant().create()).id
        }
        return {
            id: randomUUID(),
            tenantId,
            name: faker.person.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: faker.helpers.arrayElement([UserRole.ADMIN, UserRole.MANAGER, UserRole.VIEWER]),
            mfaSecret: null,
            mfaRecoveryCodes: null,
            mfaFactorConfirmedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    }

    protected async createEntity(): Promise<User> {
        const def = { ...(await this.defaultDefinition()), ...this.overrides };
        const password = await PasswordHash.create(def.password);
        return new User(
            def.id,
            def.tenantId,
            def.name,
            Email.create(def.email),
            password,
            def.role,
            def.mfaSecret,
            def.mfaRecoveryCodes,
            def.mfaFactorConfirmedAt,
            def.createdAt,
            def.updatedAt
        );
    }

    public with2FA(): UserFactoryBuilder {
        this.state({
            mfaSecret: '123456',
            mfaRecoveryCodes: '123456',
            mfaFactorConfirmedAt: new Date(),
        })
        return this;
    }

    public async createMfaUnverifiedUser(): Promise<{ user: User, token: string }> {
        const user = await this.create();
        const token = await this.tokenGenerator.generateMfaToken(user);

        return { user, token };
    }

    public async createAuthenticatedUser(): Promise<{ user: User, auth: TokenPayload }> {
        const user = await this.create();
        const auth = await this.tokenGenerator.generateToken(user);

        return { user, auth };
    }


}
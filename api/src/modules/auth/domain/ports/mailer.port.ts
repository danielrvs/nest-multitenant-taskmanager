import { User } from "@/modules/users/domain/entities/user.entity";

export abstract class MailerPort {
    abstract sendWelcomeEmail(tenantId: string, to: string, name: string): Promise<void>;
    abstract sendForgotPasswordEmail(user: User, token: string): Promise<void>;
}
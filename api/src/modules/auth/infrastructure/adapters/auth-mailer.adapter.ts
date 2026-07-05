import { User } from "@/modules/users/domain/entities/user.entity";
import { MailerPort } from "../../domain/ports/mailer.port";

export class AuthMailerAdapter implements MailerPort {
    async sendWelcomeEmail(tenantId: string, to: string, name: string): Promise<void> {
        console.log('Sending welcome email to ' + to + ' with name ' + name)
    }

    async sendForgotPasswordEmail(user: User, token: string): Promise<void> {
        console.log('Sending forgot password email to ' + user.email.toString() + ' with name ' + user.name)
    }

    async sendResetPasswordEmail(user: User): Promise<void> {
        console.log('Sending reset password email to ' + user.email.toString() + ' with name ' + user.name)
    }
}
import { MailerPort } from "../../domain/ports/mailer.port";

export class AuthMailerAdapter implements MailerPort {
    async sendWelcomeEmail(tenantId: string, to: string, name: string): Promise<void> {
        console.log('Sending welcome email to ' + to + ' with name ' + name)
    }
}
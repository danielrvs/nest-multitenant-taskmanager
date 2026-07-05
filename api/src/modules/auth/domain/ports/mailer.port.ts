export abstract class MailerPort {
    abstract sendWelcomeEmail(tenantId: string, to: string, name: string): Promise<void>;
}
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MfaActivateCommand } from "../commands/mfa-activate.command";

@CommandHandler(MfaActivateCommand)
export class MfaActivateHandler implements ICommandHandler<MfaActivateCommand> {
    constructor() { }

    async execute(command: MfaActivateCommand): Promise<void> {
        console.log('MfaActivateHandler', command);
    }
}
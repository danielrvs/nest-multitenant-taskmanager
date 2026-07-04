import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { MfaActivateCommand } from "../commands/mfa-activate.command";
import { MfaValidatorPort } from "../../domain/ports/mfa-validator.port";
import { UserRepositoryPort } from "@/modules/users/domain/ports/user.repository.port";
import { MfaBackupCodesRepositoryPort } from "../../domain/ports/mfa-backup-codes.repository.port";
import { BadRequestException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { MfaBackupCodes } from "../../domain/entities/mfa-backup-codes.entity";

@CommandHandler(MfaActivateCommand)
export class MfaActivateHandler implements ICommandHandler<MfaActivateCommand> {
    constructor(private readonly mfaValidator: MfaValidatorPort,
        private readonly userRepository: UserRepositoryPort,
        private readonly mfaBackupCodesRepository: MfaBackupCodesRepositoryPort
    ) { }

    async execute(command: MfaActivateCommand): Promise<string[]> {
        const { user, totpCode } = command;


        const userFound = await this.userRepository.findById(user.userId);

        if (!userFound) {
            throw new NotFoundException('User not found');
        }

        if (!userFound.mfaSecret) {
            throw new BadRequestException('MFA is not activated');
        }

        const isValid = await this.mfaValidator.validate(userFound.mfaSecret, totpCode);

        if (!isValid) {
            throw new UnauthorizedException('Invalid MFA code');
        }

        userFound.enableMfa();

        await this.userRepository.update(userFound.id, userFound);

        const backupCodes: MfaBackupCodes[] = [];
        for (let i = 0; i < 8; i++) {
            const backupCode = MfaBackupCodes.create({ userId: userFound.id });
            backupCodes.push(backupCode);
        }

        await this.mfaBackupCodesRepository.createMany(backupCodes);

        const plainTextCodes = backupCodes.map(code => code.code);

        return plainTextCodes;

    }
}
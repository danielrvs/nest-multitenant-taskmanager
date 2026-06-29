import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginCommand } from "../commands/login.command";
import { UserRepositoryPort } from "../../../users/domain/ports/user.repository.port";
import { UnauthorizedException } from "@nestjs/common";
import { User } from "@/modules/users/domain/entities/user.entity";
import { LoginResDto } from "../dtos/login.res.dto";
import { TokenGeneratorPort, TokenPayload } from "../../domain/ports/token-generator.port";
import { MFALoginResDto } from "../dtos/mfa-login.res.dto";

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {

    constructor(
        private readonly userRepository: UserRepositoryPort,
        private readonly tokenGenerator: TokenGeneratorPort
    ) { }

    async execute(command: LoginCommand): Promise<LoginResDto | MFALoginResDto> {

        const { email, password } = command;
        const user = await this.findUser(email);
        await this.validatePassword(user, password);
        const mfaActive = this.isMfaActive(user);
        if (mfaActive) return await this.mfaToken(user);
        return await this.loginToken(user);
    }

    private async findUser(email: string): Promise<User> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new UnauthorizedException("The credentials are not valid");
        return user;
    }

    private async validatePassword(user: User, password: string): Promise<void> {
        const isMatch = await user.password.compare(password);
        if (!isMatch) throw new UnauthorizedException("The credentials are not valid");
    }

    private async generateToken(user: User): Promise<TokenPayload> {
        return this.tokenGenerator.generateToken(user);
    }

    private isMfaActive(user: User): boolean {
        if (user.mfaFactorConfirmedAt) return true;
        return false;
    }

    private async mfaToken(user: User): Promise<MFALoginResDto> {
        const mfaToken = await this.tokenGenerator.generateMfaToken(user);
        return {
            mfaToken: mfaToken,
            expiresIn: 300,
            twoFactorEnabled: true
        }
    }

    private async loginToken(user: User): Promise<LoginResDto> {
        const token = await this.generateToken(user);
        return {
            accessToken: token.accessToken,
            user: {
                id: user.id,
                tenantId: user.tenantId,
                name: user.name,
                email: user.email.toString(),
                role: user.role
            },
            expiresIn: token.expiresIn,
            refreshToken: token.refreshToken,
            twoFactorEnabled: false
        }
    }
}

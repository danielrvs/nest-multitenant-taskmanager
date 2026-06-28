import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginCommand } from "../commands/login.command";
import { UserRepositoryPort } from "../../../users/domain/ports/user.repository.port";
import { UnauthorizedException } from "@nestjs/common";
import { User } from "@/modules/users/domain/entities/user.entity";
import { LoginResDto } from "../dtos/login.res.dto";

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {

    constructor(
        private readonly userRepository: UserRepositoryPort,
    ) { }

    async execute(command: LoginCommand): Promise<LoginResDto> {

        const { email, password } = command;
        const user = await this.findUser(email);
        await this.validatePassword(user, password);

        const token = await this.generateToken(user);
        return {
            accessToken: "token",
            user: {
                id: user.id,
                name: user.name,
                email: user.email.toString(),
                role: user.role
            },
            expiresIn: 60 * 60,
            refreshToken: "token"
        }
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

    private async generateToken(user: User): Promise<void> {
        // TODO: implement token generation
    }
}

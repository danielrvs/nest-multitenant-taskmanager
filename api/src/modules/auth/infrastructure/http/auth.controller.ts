import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Body, Controller, Post } from "@nestjs/common";
import { LoginReqDto } from "../../application/dtos/login.req.dto";
import { LoginResDto } from "../../application/dtos/login.res.dto";
import { LoginCommand } from "../../application/commands/login.command";


@Controller('auth')
export class AuthController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    @Post('login')
    async login(@Body() dto: LoginReqDto): Promise<LoginResDto> {
        const command = new LoginCommand(dto.email, dto.password);
        return this.commandBus.execute(command);
    }
}
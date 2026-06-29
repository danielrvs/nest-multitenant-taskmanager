import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { LoginReqDto } from "../../application/dtos/login.req.dto";
import { LoginResDto } from "../../application/dtos/login.res.dto";
import { LoginCommand } from "../../application/commands/login.command";
import { ResponseMessage } from "@/shared/infrastructure/decorators/response-message.decorator";
import { MFALoginResDto } from "../../application/dtos/mfa-login.res.dto";
import { Response } from "express";
import { JwtAuthGuard } from "@/shared/infrastructure/guards/jwt-auth.guard";
import { CurrentUser } from "@/shared/infrastructure/decorators/current-user.decorator";
import { Authenticated } from "../../domain/interfaces/authenticated.interface";
import { LogoutCommand } from "../../application/commands/logout.command";
import { CustomThrottlerGuard } from "@/shared/infrastructure/guards/custom-throttler.guard";


@Controller('auth')
@UseGuards(CustomThrottlerGuard)
export class AuthController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    @Post('login')
    @ResponseMessage("User logged in successfully")
    async login(@Body() dto: LoginReqDto, @Res({ passthrough: true }) res: Response): Promise<LoginResDto | MFALoginResDto> {
        const command = new LoginCommand(dto.email, dto.password);
        const result = await this.commandBus.execute<LoginCommand, LoginResDto | MFALoginResDto>(command);

        if (result.twoFactorEnabled === true) {
            res.status(HttpStatus.ACCEPTED)
            return result;
        }
        res.status(HttpStatus.OK)
        return result;
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ResponseMessage("User logged out successfully")
    async logout(@CurrentUser() user: Authenticated, @Req() req: any): Promise<void> {
        const refreshToken = req.cookies['refresh-token'];
        const command = new LogoutCommand(user.userId, refreshToken);
        return await this.commandBus.execute<LogoutCommand>(command);
    }



}
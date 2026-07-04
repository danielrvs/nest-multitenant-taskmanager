import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { LoginReqDto } from "../../application/dtos/login.req.dto";
import { LoginResDto } from "../../application/dtos/login.res.dto";
import { LoginCommand } from "../../application/commands/login.command";
import { ResponseMessage } from "@/shared/infrastructure/decorators/response-message.decorator";
import { MFALoginResDto } from "../../application/dtos/mfa-login.res.dto";
import { Response } from "express";
import { CurrentUser } from "@/shared/infrastructure/decorators/current-user.decorator";
import { Authenticated } from "../../domain/interfaces/authenticated.interface";
import { LogoutCommand } from "../../application/commands/logout.command";
import { CustomThrottlerGuard } from "@/shared/infrastructure/guards/custom-throttler.guard";
import { Public } from "@/shared/infrastructure/decorators/public.decorator";


@Controller('auth')
@UseGuards(CustomThrottlerGuard)
export class AuthController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus
    ) { }

    @Post('login')
    @Public()
    @ResponseMessage("User logged in successfully")
    async login(@Body() dto: LoginReqDto, @Res({ passthrough: true }) res: Response): Promise<LoginResDto | MFALoginResDto> {
        const command = new LoginCommand(dto.email, dto.password);
        const result = await this.commandBus.execute<LoginCommand, LoginResDto | MFALoginResDto>(command);

        if (result.mfaRequired === true && result instanceof MFALoginResDto) {
            res.status(HttpStatus.ACCEPTED)
            res.cookie('access_token', result.mfaToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: result.expiresIn * 1000
            });
            return result;
        }

        if (result instanceof LoginResDto) {
            res.cookie('access_token', result.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: result.expiresIn * 1000
            });

            res.cookie('refresh_token', result.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7 * 1000
            });
        }


        res.status(HttpStatus.OK)
        return result;
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ResponseMessage("User logged out successfully")
    async logout(
        @CurrentUser() user: Authenticated,
        @Req() req: any,
        @Res({ passthrough: true }) res: Response
    ): Promise<void> {
        const refreshToken = req.cookies?.['refresh_token'] || req.body?.refreshToken;
        const command = new LogoutCommand(user.userId, refreshToken);
        await this.commandBus.execute<LogoutCommand>(command);

        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
    }

}
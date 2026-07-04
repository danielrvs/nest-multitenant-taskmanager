import { CurrentUser } from "@/shared/infrastructure/decorators/current-user.decorator";
import { Public } from "@/shared/infrastructure/decorators/public.decorator";
import { ResponseMessage } from "@/shared/infrastructure/decorators/response-message.decorator";
import { JwtMfaAuthGuard } from "@/shared/infrastructure/guards/jwt-mfa-auth.guard";
import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseGuards } from "@nestjs/common";
import { MfaChallengeReqDto } from "../../application/dtos/mfa-challenge.req.dto";
import { MfaAuthenticated } from "../../domain/interfaces/mfa-authenticated.interface";
import { LoginResDto } from "../../application/dtos/login.res.dto";
import { MfaChallengeCommand } from "../../application/commands/mfa-challenge.command";
import { CommandBus } from "@nestjs/cqrs";
import { Response } from "express";
import { Authenticated } from "../../domain/interfaces/authenticated.interface";
import { MfaSetupCommand } from "../../application/commands/mfa-setup.command";
import { MfaSetupResDto } from "../../application/dtos/mfa-setup.res.dto";


@Controller('auth/mfa')
export class MfaController {

    constructor(
        private readonly commandBus: CommandBus
    ) { }

    @Post('setup')
    @ResponseMessage('MFA setup initiated')
    @HttpCode(HttpStatus.OK)
    async mfaSetup(@CurrentUser() user: Authenticated): Promise<MfaSetupResDto> {
        const command = new MfaSetupCommand(user);
        const res = await this.commandBus.execute<MfaSetupCommand, string>(command);
        return {
            qrCodeUri: res
        }
    }

    @Post('challenge')
    @Public()
    @UseGuards(JwtMfaAuthGuard)
    @ResponseMessage('MFA challenge completed successfully')
    @HttpCode(HttpStatus.OK)
    async mfaChallenge(
        @Body() dto: MfaChallengeReqDto,
        @CurrentUser() user: MfaAuthenticated,
        @Res({ passthrough: true }) res: Response,
    ): Promise<LoginResDto> {
        const command = new MfaChallengeCommand(user, dto.totpCode);
        const result = await this.commandBus.execute<MfaChallengeCommand, LoginResDto>(command);

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

        return result;
    }


}
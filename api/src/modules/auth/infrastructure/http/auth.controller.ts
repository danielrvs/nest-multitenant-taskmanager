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
import { Public } from "@/shared/infrastructure/decorators/public.decorator";
import { JwtMfaAuthGuard } from "@/shared/infrastructure/guards/jwt-mfa-auth.guard";
import { MfaChallengeReqDto } from "../../application/dtos/mfa-challenge.req.dto";
import { MfaAuthenticated } from "../../domain/interfaces/mfa-authenticated.interface";
import { MfaChallengeCommand } from "../../application/commands/mfa-challenge.command";


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

        if (result.mfaRequired === true) {
            res.status(HttpStatus.ACCEPTED)
            return result;
        }
        res.status(HttpStatus.OK)
        return result;
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ResponseMessage("User logged out successfully")
    async logout(@CurrentUser() user: Authenticated, @Req() req: any): Promise<void> {
        const refreshToken = req.cookies['refresh-token'];
        const command = new LogoutCommand(user.userId, refreshToken);
        return await this.commandBus.execute<LogoutCommand>(command);
    }

    @Post('mfa/challenge')
    @Public()
    @UseGuards(JwtMfaAuthGuard)
    @ResponseMessage('MFA challenge completed successfully')
    @HttpCode(HttpStatus.OK)
    async mfaChallenge(
        @Body() dto: MfaChallengeReqDto,
        @CurrentUser() user: MfaAuthenticated
    ): Promise<LoginResDto> {
        const command = new MfaChallengeCommand(user, dto.totpCode);
        const result = await this.commandBus.execute<MfaChallengeCommand, LoginResDto>(command);
        return result;
    }



}
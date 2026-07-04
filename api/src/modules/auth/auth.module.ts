import { Module } from "@nestjs/common";
import { AuthController } from "./infrastructure/http/auth.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { UserModule } from "../users/user.module";
import { LoginHandler } from "./application/handlers/login.handler";
import { RefreshTokenRepositoryPort } from "./domain/ports/refresh-token.repository.port";
import { PrismaRefreshTokenRepository } from "./infrastructure/adapters/prisma-refresh-token.repository";
import { TokenGeneratorPort } from "./domain/ports/token-generator.port";
import { JwtTokenGeneratorAdapter } from "./infrastructure/adapters/jwt-token-generator.adapter";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./infrastructure/strategies/jwt.strategy";
import { LogoutHandler } from "./application/handlers/logout.handler";
import { MfaChallengeHandler } from "./application/handlers/mfa-challenge.handler";
import { MfaController } from "./infrastructure/http/mfa.controller";
import { MfaValidatorPort } from "./domain/ports/mfa-validator.port";
import { OtplibMfaValidatorAdapter } from "./infrastructure/adapters/otplib-mfa-validator.adapter";
import { MfaSetupHandler } from "./application/handlers/mfa-setup.handler";
import { MfaGeneratorPort } from "./domain/ports/mfa-generator.port";
import { OtplibMfaGeneratorAdapter } from "./infrastructure/adapters/otplib-mfa-generator.adapter";
import { MfaBackupCodesRepositoryPort } from "./domain/ports/mfa-backup-codes.repository.port";
import { PrismaMfaBackupCodesRepository } from "./infrastructure/adapters/prisma-mfa-backup-codes.repository.adapter";


const commandHandlers = [
    LoginHandler, LogoutHandler, MfaSetupHandler, MfaChallengeHandler
]
const queriesHandlers = []

@Module({
    imports: [
        CqrsModule,
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '3600s' },
            }),
        }),
        PassportModule,
        UserModule],
    controllers: [AuthController, MfaController],
    providers: [...commandHandlers, ...queriesHandlers,
    {
        provide: RefreshTokenRepositoryPort,
        useClass: PrismaRefreshTokenRepository
    },
    {
        provide: TokenGeneratorPort,
        useClass: JwtTokenGeneratorAdapter
    },
    {
        provide: MfaValidatorPort,
        useClass: OtplibMfaValidatorAdapter
    },
    {
        provide: MfaGeneratorPort,
        useClass: OtplibMfaGeneratorAdapter
    },
    {
        provide: MfaBackupCodesRepositoryPort,
        useClass: PrismaMfaBackupCodesRepository
    },
        JwtStrategy
    ]
})

export class AuthModule { }
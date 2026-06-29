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


const commandHandlers = [LoginHandler, LogoutHandler]
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
    controllers: [AuthController],
    providers: [...commandHandlers, ...queriesHandlers,
    {
        provide: RefreshTokenRepositoryPort,
        useClass: PrismaRefreshTokenRepository
    },
    {
        provide: TokenGeneratorPort,
        useClass: JwtTokenGeneratorAdapter
    },
        JwtStrategy
    ]
})

export class AuthModule { }
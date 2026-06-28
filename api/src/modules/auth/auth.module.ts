import { Module } from "@nestjs/common";
import { AuthController } from "./infrastructure/http/auth.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { UserModule } from "../users/user.module";
import { LoginHandler } from "./application/handlers/login.handler";
import { RefreshTokenRepositoryPort } from "./domain/ports/refresh-token.repository.port";
import { PrismaRefreshTokenRepository } from "./infrastructure/adapters/prisma-refresh-token.repository";


const commandHandlers = [LoginHandler]
const queriesHandlers = []

@Module({
    imports: [CqrsModule, UserModule],
    controllers: [AuthController],
    providers: [...commandHandlers, ...queriesHandlers,
    {
        provide: RefreshTokenRepositoryPort,
        useClass: PrismaRefreshTokenRepository
    }
    ]
})

export class AuthModule { }
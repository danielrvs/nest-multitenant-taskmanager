import { Injectable } from "@nestjs/common";
import { TokenGeneratorPort, TokenPayload } from "../../domain/ports/token-generator.port";
import { User } from "@/modules/users/domain/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { MfaAuthenticated } from "../../domain/interfaces/mfa-authenticated.interface";
import { Authenticated } from "../../domain/interfaces/authenticated.interface";

@Injectable()
export class JwtTokenGeneratorAdapter implements TokenGeneratorPort {
    constructor(
        private readonly jwtService: JwtService
    ) { }

    async generateToken(user: User): Promise<TokenPayload> {
        const payload: Authenticated = {
            userId: user.id,
            tenantId: user.tenantId,
            name: user.name,
            email: user.email.toString(),
            role: user.role,
            isMfaPending: false
        }

        const accessToken = this.jwtService.sign(payload, { expiresIn: '3600s' });
        const refreshToken = this.jwtService.sign(
            { userId: user.id, jti: randomUUID() },
            { expiresIn: '7d' }
        );

        return {
            accessToken,
            refreshToken,
            expiresIn: 3600
        };
    }

    async generateMfaToken(user: User): Promise<string> {
        const payload: MfaAuthenticated = {
            userId: user.id,
            isMfaPending: true
        }
        const mfaToken = this.jwtService.sign(payload, { expiresIn: '5m' });

        return mfaToken;
    }
}
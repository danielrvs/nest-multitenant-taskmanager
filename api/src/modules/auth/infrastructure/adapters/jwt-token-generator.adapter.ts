import { Injectable } from "@nestjs/common";
import { TokenGeneratorPort, TokenPayload } from "../../domain/ports/token-generator.port";
import { User } from "@/modules/users/domain/entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";

@Injectable()
export class JwtTokenGeneratorAdapter implements TokenGeneratorPort {
    constructor(
        private readonly jwtService: JwtService
    ) { }

    async generateToken(user: User): Promise<TokenPayload> {
        const payload = {
            userId: user.id,
            tenantId: user.tenantId,
            name: user.name,
            email: user.email.toString(),
            role: user.role
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
        const payload = {
            userId: user.id,
            isMfaPending: true
        }
        const mfaToken = this.jwtService.sign(payload, { expiresIn: '5m' });

        return mfaToken;
    }
}
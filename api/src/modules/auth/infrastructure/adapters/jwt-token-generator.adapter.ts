import { Injectable } from "@nestjs/common";
import { TokenGeneratorPort, TokenPayload } from "../../domain/ports/token-generator.port";
import { User } from "@/modules/users/domain/entities/user.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtTokenGeneratorAdapter implements TokenGeneratorPort {
    constructor(
        private readonly jwtService: JwtService
    ) { }

    async generateToken(user: User): Promise<TokenPayload> {
        const payload = {
            sub: user.id,
            name: user.name,
            email: user.email.toString(),
            role: user.role
        }
        const accessToken = this.jwtService.sign(payload, { expiresIn: '3600s' });
        const refreshToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '7d' });

        return {
            accessToken,
            refreshToken,
            expiresIn: 3600
        };
    }

    async generateMfaToken(user: User): Promise<string> {
        throw new Error("Method not implemented.");
    }
}
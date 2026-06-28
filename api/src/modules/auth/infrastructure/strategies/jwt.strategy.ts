import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Authenticated } from "../../domain/interfaces/authenticated.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
            ignoreExpiration: false,
        })
    }

    async validate(payload: any): Promise<Authenticated> {
        return {
            tenantId: payload.tenantId,
            userId: payload.userId,
            name: payload.name,
            email: payload.email,
            role: payload.role,
        };
    }
}
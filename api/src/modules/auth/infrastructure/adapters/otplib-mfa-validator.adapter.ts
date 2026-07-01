import { Injectable } from "@nestjs/common";
import { MfaValidatorPort } from "../../domain/ports/mfa-validator.port";
import { Cache } from "cache-manager";
import { verify } from "otplib";

@Injectable()
export class OtplibMfaValidatorAdapter implements MfaValidatorPort {
    constructor(private readonly cacheManager: Cache) { }

    async validate(mfaSecret: string, mfaToken: string): Promise<boolean> {
        const isValid = await verify({ token: mfaToken, secret: mfaSecret });
        if (!isValid) return false;

        const cacheKey = `mfa:used:${mfaSecret}:${mfaToken}`;
        const used = await this.cacheManager.get(cacheKey);
        if (used) return false;

        await this.cacheManager.set(cacheKey, true, 60 * 1000);
        return true;
    }
}
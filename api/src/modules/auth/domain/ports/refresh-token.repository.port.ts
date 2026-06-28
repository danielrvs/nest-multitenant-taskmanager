import { RefreshToken } from "../entities/refresh-token.entity";

export abstract class RefreshTokenRepositoryPort {
    abstract create(refreshToken: RefreshToken): Promise<void>;
    abstract findByToken(token: string): Promise<RefreshToken | null>;
    abstract delete(token: string): Promise<void>;
    abstract deleteAllByUserId(userId: string): Promise<void>;
}
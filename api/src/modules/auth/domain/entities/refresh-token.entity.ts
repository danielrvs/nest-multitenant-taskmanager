import { randomUUID } from "crypto";

export class RefreshToken {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly token: string,
        public readonly expiresAt: Date,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {

    }

    static create(userId: string, token: string, expiresAt: Date): RefreshToken {
        const now = new Date();
        return new RefreshToken(
            randomUUID(),
            userId,
            token,
            expiresAt,
            now,
            now
        )
    }
}

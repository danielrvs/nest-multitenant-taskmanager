import { randomUUID } from "crypto"

export class Tenant {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly createdAt: Date,
        public readonly updatedAt: Date,

    ) { }

    static create(data: {
        name: string
    }): Tenant {
        const now = new Date();
        return new Tenant(
            randomUUID(),
            data.name,
            now,
            now
        )
    }
}
import { Authenticated } from "@/modules/auth/domain/interfaces/authenticated.interface";

export class DeleteTaskCommand {
    constructor(
        public readonly currentUser: Authenticated,
        public readonly id: string
    ) {}
}

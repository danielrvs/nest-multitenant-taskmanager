import { MfaAuthenticated } from "../../domain/interfaces/mfa-authenticated.interface";

export class MfaChallengeCommand {
    constructor(
        public readonly user: MfaAuthenticated,
        public readonly totpCode: string
    ) { }
}
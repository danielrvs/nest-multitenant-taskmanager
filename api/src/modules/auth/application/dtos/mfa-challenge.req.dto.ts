import { IsNotEmpty, IsString } from "class-validator";

export class MfaChallengeReqDto {
    @IsString()
    @IsNotEmpty()
    totpCode: string;
}
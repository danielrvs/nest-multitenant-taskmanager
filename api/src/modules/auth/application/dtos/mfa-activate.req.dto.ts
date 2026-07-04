import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class MfaActivateReqDto {
    @ApiProperty({
        description: 'The TOTP code to verify',
        example: '123456',
        minLength: 6,
        maxLength: 6,
    })
    @IsString()
    @IsNotEmpty()
    @Length(6, 6, { message: 'The TOTP code must be 6 digits long' })
    totpCode: string;
}
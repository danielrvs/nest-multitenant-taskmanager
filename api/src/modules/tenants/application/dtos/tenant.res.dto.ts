import { ApiProperty } from "@nestjs/swagger";

export class TenantResDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Unique ID from the created tenant'
    })
    id: string;


    @ApiProperty({
        example: 'Acme Corp',
        description: 'Name of the tenant'
    })
    name: string;

    @ApiProperty({
        example: '2026-01-15T10:30:00.000Z',
        description: 'Date when the user was created'
    })
    createdAt: string;

    @ApiProperty({
        example: '2026-01-15T10:30:00.000Z',
        description: 'Date when the user was updated'
    })
    updatedAt: string;
}
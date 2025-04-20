import {ApiProperty} from "@nestjs/swagger";

export class ErrorResponseDto {
    @ApiProperty({
        description: 'Error message',
        example: 'Unauthorized'
    })
    message: string;
    @ApiProperty({
        description: 'HTTP status code',
        example: 401
    })
    statusCode: number;
    @ApiProperty({
        description: 'Error name',
        example: 'UnauthorizedException'
    })
    error: string;
}
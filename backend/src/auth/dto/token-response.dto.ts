import {ApiProperty} from '@nestjs/swagger';

export class TokenResponseDto {
    @ApiProperty({description: 'Access token', example: 'access_token'})
    accessToken: string;

    refreshToken: string;

    @ApiProperty({
        description: 'User information',
        example: {id: 'user123', email: 'user@example.com', name: 'John Doe'}
    })
    user: {
        id: string;
        email: string;
        name: string;
    };
}

import {IsEmail, MinLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger'; // added

export class LoginAuthenticationDto {
    @ApiProperty({example: 'jane.doe@example.com', description: 'User email'}) // added
    @IsEmail({}, {message: 'Please provide your email'})
    email: string;

    @ApiProperty({example: 'Str0ng!Pass', description: 'User password'}) // added
    @MinLength(8, {message: 'Please provide your password'})
    password: string;
}

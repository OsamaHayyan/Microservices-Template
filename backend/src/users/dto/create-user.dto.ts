import {IsEmail, MinLength, Matches} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        example: 'jane.doe@example.com',
        description: 'Valid email address of the user.',
    })
    @IsEmail({}, {message: 'Invalid email format.'})
    email: string;

    @ApiProperty({
        example: 'Jane Doe',
        description: 'User full name. Minimum 3 characters.',
    })
    @MinLength(3, {message: 'Name must be at least 3 characters long.'})
    name: string;

    @ApiProperty({
        example: 'Str0ng!Pass',
        description: 'Password must be at least 8 characters long and include a letter, a number, and a special character.',
    })
    @MinLength(8, {message: 'Password must be at least 8 characters long.'})
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, {
        message: 'Password must contain at least one letter, one number, and one special character.',
    })
    password: string;
}

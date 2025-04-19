import {IsEmail, MinLength} from 'class-validator';

export class LoginAuthenticationDto {
  @IsEmail({}, { message: 'Please provide your email' })
  email: string;

  @MinLength(8, { message: 'Please provide your password' })
  password: string;
}
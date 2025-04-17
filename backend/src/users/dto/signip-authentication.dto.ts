import { IsEmail, MinLength, Matches } from 'class-validator';

export class SigninAuthenticationDto {
  @IsEmail({}, { message: 'Please provide your email' })
  email: string;

  @MinLength(8, { message: 'Please provide your password' })
  password: string;
}
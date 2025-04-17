import { IsEmail, MinLength, Matches } from 'class-validator';

export class SignupAuthenticationDto {
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;

  @MinLength(3, { message: 'Name must be at least 3 characters long.' })
  name: string;

  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/, {
    message: 'Password must contain at least one letter, one number, and one special character.'
  })
  password: string;
}
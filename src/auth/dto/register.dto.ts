import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

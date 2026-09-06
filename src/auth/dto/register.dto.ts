import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email musí mať platný formát' })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @IsOptional()
  @IsString({ message: 'Meno musí byť text' })
  @MinLength(2, { message: 'Meno musí obsahovať aspoň 2 znaky' })
  name: string;
}

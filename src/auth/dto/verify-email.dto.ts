import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyEmailDTO {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 6)
  code: string;
}

import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateNameDto {
  @IsOptional()
  @IsString({ message: 'Meno musí byť text' })
  @MinLength(2, { message: 'Meno musí obsahovať aspoň 2 znaky' })
  name?: string | null;
}

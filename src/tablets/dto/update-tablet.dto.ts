import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { PackageState } from './create-tablet.dto';

export class UpdateTabletDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsEnum(PackageState)
  packageState?: PackageState;
}

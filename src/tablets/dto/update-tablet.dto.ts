import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateTabletDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  fullQuantity?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  openedQuantity?: number;
}

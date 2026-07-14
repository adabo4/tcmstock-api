import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class CreateTabletDto {
  @IsInt()
  tabletCatalogId!: number;

  @IsInt()
  @Min(0)
  fullQuantity!: number;

  @IsInt()
  @Min(0)
  openedQuantity!: number;
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  stockLocationId?: number;
}

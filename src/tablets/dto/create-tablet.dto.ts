import { IsInt, Min } from 'class-validator';

export class CreateTabletDto {
  @IsInt()
  tabletCatalogId: number;

  @IsInt()
  @Min(0)
  quantity: number;
}

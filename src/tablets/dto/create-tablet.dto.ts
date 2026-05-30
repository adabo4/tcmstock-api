import { IsEnum, IsInt, Min } from 'class-validator';

export enum PackageState {
  FULL = 'FULL',
  OPENED = 'OPENED',
}

export class CreateTabletDto {
  @IsInt()
  tabletCatalogId: number;

  @IsInt()
  @Min(0)
  quantity: number;

  @IsEnum(PackageState)
  packageState: PackageState;
}

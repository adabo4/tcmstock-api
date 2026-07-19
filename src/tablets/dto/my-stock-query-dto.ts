// dto/my-stock-query.dto.ts

import { ProductType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum StockStatus {
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export enum PackageStatus {
  OPENED = 'OPENED',
  CLOSED = 'CLOSED',
}

export class MyStockQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ProductType)
  type?: ProductType;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 15;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  stockLocationId?: number;

  @IsOptional()
  @IsEnum(StockStatus)
  status?: StockStatus;

  @IsOptional()
  @IsEnum(PackageStatus)
  packageStatus?: PackageStatus;
}

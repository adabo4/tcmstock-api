import { IsInt, Min } from 'class-validator';

export class UpdateTabletDto {
  @IsInt()
  @Min(0)
  quantity: number;
}

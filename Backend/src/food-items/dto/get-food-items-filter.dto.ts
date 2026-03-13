import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetFoodItemsFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;
}

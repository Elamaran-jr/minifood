import { IsString, IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  foodId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

import { IsPositive } from 'class-validator';

export class OrderProductDto {
  @IsPositive()
  productId: number;

  @IsPositive()
  quantity: number;

  @IsPositive()
  buyerId: number;
}

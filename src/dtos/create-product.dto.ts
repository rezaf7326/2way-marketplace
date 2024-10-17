import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsPositive()
  sellerId: number;
}

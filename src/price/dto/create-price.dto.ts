import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreatePriceDto {
  @ApiProperty({ example: '100.000', type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  base_price: number;

  @ApiProperty({ example: '100.000', type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  discount_price: number;

  @ApiProperty({ example: '2021-09-01', type: Date })
  @IsNotEmpty()
  @Type(() => Date)
  start_date: Date;

  @ApiProperty({ example: '2021-09-30', type: Date })
  @IsNotEmpty()
  @Type(() => Date)
  end_date: Date;

  @ApiProperty({ example: '1', type: Number })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  productId: number;
}

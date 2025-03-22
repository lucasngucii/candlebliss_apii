import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateGiftsDto {
  @ApiProperty({ example: 'Nen Thom Huong Vai', type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Mo ta', type: String })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'https://www.youtube.com/watch?v=675zElzOFuc',
    type: String,
  })
  @IsString()
  @IsOptional()
  video?: string;

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

  @ApiProperty({ type: [Number] })
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',').map(Number) : value,
  )
  productDetailIds: number[];
}

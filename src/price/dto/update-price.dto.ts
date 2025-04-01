import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePriceDto {
  @ApiPropertyOptional({ example: '100.000', type: Number })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  base_price: number;

  @ApiPropertyOptional({ example: '100.000', type: Number })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discount_price: number;

  @ApiPropertyOptional({ example: '2021-09-01', type: Date })
  @IsOptional()
  @Type(() => Date)
  start_date: Date;

  @ApiPropertyOptional({ example: '2021-09-30', type: Date })
  @IsOptional()
  @Type(() => Date)
  end_date: Date;
}

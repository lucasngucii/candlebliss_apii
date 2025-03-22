import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateHistoryPriceDto {
  @ApiProperty({ example: '100.000', type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  old_price: number;

  @ApiProperty({ example: '100.000', type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  new_price: number;

  @ApiProperty({ example: '2021-09-01', type: Date })
  @IsNotEmpty()
  @Type(() => Date)
  changed_at: Date;

  @ApiProperty({ example: 'admin 01', type: String })
  @IsNotEmpty()
  changed_by: string;

  @ApiProperty({ example: '1', type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  productId: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ example: 2, description: 'Số lượng sản phẩm' })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @ApiProperty({ example: 1, description: 'ID của chi tiết sản phẩm' })
  @IsNotEmpty()
  @IsNumber()
  product_detail_id: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateItemDto } from './create-item.dto';

export class CreateOrdersDto {
  @ApiProperty({ example: 1, description: 'ID của người dùng' })
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({
    required: false,
    example: '123 ABC Street',
    description: 'Địa chỉ giao hàng',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    type: 'string',
    description: 'code voucher',
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  voucher_code?: string;

  @ApiProperty({
    type: [CreateItemDto],
    description: 'Danh sách các sản phẩm trong đơn hàng',
    example: [{ quantity: 2, product_detail_id: 'pd-123' }],
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  item: CreateItemDto[];
}

export class AddVoucherDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  voucher_code?: string;
}

export class AddPaymentMethodDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  payment_method?: string;
}

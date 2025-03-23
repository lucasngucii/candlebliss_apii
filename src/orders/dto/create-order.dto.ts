import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOrdersDto {
  @ApiProperty()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string;
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

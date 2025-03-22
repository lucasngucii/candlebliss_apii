import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateVoucherDto } from './create-voucher.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateVoucherDto extends PartialType(CreateVoucherDto) {
  @ApiPropertyOptional({ type: String, example: 'CODE123456' })
  @IsOptional()
  @IsString()
  code?: string;
}

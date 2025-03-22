import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from './create-address.dto';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {
  @ApiPropertyOptional({ example: 'Ho Chi Minh', type: String })
  @IsOptional()
  @Transform(lowerCaseTransformer)
  province: string;

  @ApiPropertyOptional({ example: 'District 1', type: String })
  @IsOptional()
  @Transform(lowerCaseTransformer)
  district: string;

  @ApiPropertyOptional({ example: 'District 2', type: String })
  @IsOptional()
  @Transform(lowerCaseTransformer)
  street: string;

  @ApiPropertyOptional({ example: 'District 3', type: String })
  @IsOptional()
  @Transform(lowerCaseTransformer)
  ward: string;
}

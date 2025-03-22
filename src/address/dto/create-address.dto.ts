import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';
import { Transform } from 'class-transformer';

export class CreateAddressDto {
  @ApiProperty({ example: 'Ho Chi Minh', type: String })
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  province: string;

  @ApiProperty({ example: 'District 1', type: String })
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  district: string;

  @ApiProperty({ example: '1234567890', type: String })
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  street: string;

  @ApiProperty({ example: 'Ward 1', type: String })
  @IsNotEmpty()
  @Transform(lowerCaseTransformer)
  ward: string;

  @ApiProperty({ example: 1, type: Number })
  @IsNotEmpty()
  @IsNumber({}, { message: 'userId must be a valid number' })
  userId: number;
}

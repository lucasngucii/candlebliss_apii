import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateGiftsDto } from './create-gift.dto';
import { IsOptional, IsString } from 'class-validator';
import { UpdatePriceDto } from '../../price/dto/update-price.dto';
import { Type } from 'class-transformer';

export class UpdateGiftDto extends PartialType(CreateGiftsDto) {
  @ApiPropertyOptional({ type: String, example: 'Nem thom' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: String, example: 'Mo ta' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'https://www.youtube.com/watch?v=675zElzOFuc',
  })
  @IsOptional()
  @IsString()
  video?: string;

  @ApiPropertyOptional({ type: UpdatePriceDto })
  @IsOptional()
  @Type(() => UpdatePriceDto)
  prices?: UpdatePriceDto;

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  productDetailId?: number[];
}

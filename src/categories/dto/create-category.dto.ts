import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ type: String, example: 'Name Category' })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  name: string;

  @ApiProperty({ type: String, example: 'category description' })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  description: string;
}

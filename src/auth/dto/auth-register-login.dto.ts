import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class AuthRegisterLoginDto {
  @ApiProperty({ example: 'lucasaleh@yopmail.com', type: String })
  @Transform(lowerCaseTransformer)
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345a@A', type: String })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Lucas' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Aleh' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 387575529 })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  phone: number;
}

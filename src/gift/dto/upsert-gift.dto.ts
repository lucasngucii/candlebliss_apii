import { ApiProperty } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"

import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class UpsertPdDto {
    pdId: number
}
export class UpsertGiftDto {
    @ApiProperty({ description: "ID of the gift", type: "string", example: "123456" })
    @IsNotEmpty()
    @IsString()
    id: string

    @ApiProperty({ example: 'Nen Thom Huong Vai', type: String })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ example: 'Mo ta', type: String })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: 'https://www.youtube.com/watch?v=675zElzOFuc',
        type: String,
    })
    @IsString()
    @IsOptional()
    video?: string;


    @ApiProperty({ description: "List Id product details", type: [Number] })
    @IsNotEmpty()
    @Transform(({ value }) =>
        typeof value === 'string' ? value.split(',').map(Number) : value,
    )
    products: number[]

    @ApiProperty({ example: '100.000', type: Number })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    base_price: number;

    @ApiProperty({ example: '100.000', type: Number })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    discount_price: number;

    @ApiProperty({ example: '2021-09-01', type: Date })
    @IsNotEmpty()
    @Type(() => Date)
    start_date: Date;

    @ApiProperty({ example: '2021-09-30', type: Date })
    @IsNotEmpty()
    @Type(() => Date)
    end_date: Date;
}
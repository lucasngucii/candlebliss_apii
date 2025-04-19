import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class QueryRatingByProductDto {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    product_id?: number;
}
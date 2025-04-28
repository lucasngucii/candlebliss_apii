import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpsertRatingDto {
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    order_id: number;
    
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    user_id: number;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    @Type(() => String)
    comment?: string;
    
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    rating?: number;
 }
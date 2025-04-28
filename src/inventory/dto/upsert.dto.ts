import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { InventoryStatus } from "../entity/inventory.entity";

export class UpsertDto { 
    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    product_detail_id: number;
    
    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    quantity: number;

    @ApiProperty({ enum: InventoryStatus, example: InventoryStatus.DECREASE })
    @IsEnum(InventoryStatus)
    status: InventoryStatus;
}

export class UpsertInventoryDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    @Type(() => String)
    update_by: string;

    @ApiProperty({ type: [UpsertDto] })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => UpsertDto)
    upsert_products: UpsertDto[];
}
import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus } from "../entity/order.entity";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

export class QueryOrdersByStatusDto {
    @ApiProperty({ enum: OrderStatus, example: OrderStatus.CREATED })
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    user_id: number;
}

export class QueryOrderByLimitAndOffsetDto {
    @ApiProperty({ required: false })
    @Type(() => Number)
    @IsNumber()
    user_id: number;

    @IsNumber()
    @Type(() => Number)
    @ApiProperty({ required: false })
    offset: number;

    @IsNumber()
    @Type(() => Number)
    @ApiProperty({ required: false })
    limit: number;
}
export class UpsertOrderByStatusDto {
    @ApiProperty({ enum: OrderStatus, example: OrderStatus.CREATED })
    @IsEnum(OrderStatus)
    status: OrderStatus;
}
export class UpsertOrderPaymentMethodDto {
    @ApiProperty({ example: 'Momo' })
    @IsString()
    payment_method: string;
}
import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus } from "../entity/order.entity";
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
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


export class QueryOrdersByStatusAllDto {
    @ApiProperty({ enum: OrderStatus, example: OrderStatus.CREATED })
    @IsEnum(OrderStatus)
    status: OrderStatus;
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

export class AddRatingDto {
    @ApiProperty({ example: 5 })
    @IsInt()
    @Type(() => Number)
    rating: number;
}
export class UpsertOrderPaymentMethodDto {
    @ApiProperty({ example: 'Momo' })
    @IsString()
    payment_method: string;
}

export enum TimeFilterEnum {
    MONTH = 'month',
    WEEK = 'week',
    YEAR = 'year',
}

export class StatisticsQueryDto {
    @ApiProperty({
        description: 'Loại bộ lọc thời gian',
        enum: TimeFilterEnum,
        default: TimeFilterEnum.MONTH,
        required: false,
    })
    @IsEnum(TimeFilterEnum)
    @IsOptional()
    timeFilter?: TimeFilterEnum = TimeFilterEnum.MONTH;

    @ApiProperty({
        description: 'Giá trị thời gian (tháng: 1-12, tuần: 1-52, năm)',
        example: 4,
        required: false,
    })
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    timeValue?: number;

    @ApiProperty({
        description: 'Năm (chỉ cần thiết khi timeFilter là month hoặc week)',
        example: 2025,
        required: false,
    })
    @IsInt()
    @Type(() => Number)
    @IsOptional()
    year?: number;
}

export class StatisticsResponseDto {
    @ApiProperty({
        description: 'Loại bộ lọc thời gian',
        enum: TimeFilterEnum,
        example: TimeFilterEnum.MONTH
    })
    timeFilter: TimeFilterEnum;

    @ApiProperty({
        description: 'Giá trị thời gian được chọn',
        example: 4
    })
    timeValue: number;

    @ApiProperty({
        description: 'Năm được chọn',
        example: 2025
    })
    year: number;

    @ApiProperty({
        description: 'Tổng doanh thu (bao gồm phí vận chuyển)',
        example: 1750000
    })
    totalRevenue: number;

    @ApiProperty({
        description: 'Tổng giá trị đơn hàng (không bao gồm phí vận chuyển)',
        example: 1640000
    })
    totalOrderValue: number;

    @ApiProperty({
        description: 'Tổng phí vận chuyển',
        example: 110000
    })
    totalShippingFee: number;

    @ApiProperty({
        description: 'Tổng số đơn hàng',
        example: 3
    })
    totalOrders: number;
}

export class QueryCancelOrderDto {
    @ApiProperty({
      example: 'Khách yêu cầu huỷ vì sản phẩm không đúng mô tả',
      description: 'Lý do huỷ đơn hàng hoặc yêu cầu đổi trả',
    })
    @IsString()
    reason: string;
  
    @ApiProperty({
      example: OrderStatus.CANCELLED,
      enum: OrderStatus,
      description: 'Trạng thái cập nhật của đơn hàng (huỷ hoặc trả hàng)',
    })
    @IsEnum(OrderStatus)
    status: OrderStatus;
  }
import { ApiProperty } from "@nestjs/swagger";

export class StatisticsResponseDto {
    @ApiProperty({ description: 'Loại bộ lọc thời gian', enum: ['month', 'week', 'year'], example: 'month' })
    timeFilter: 'month' | 'week' | 'year';

    @ApiProperty({ description: 'Giá trị thời gian được chọn', example: 4 })
    timeValue: number;

    @ApiProperty({ description: 'Năm được chọn', example: 2025 })
    year: number;

    @ApiProperty({ description: 'Tổng doanh thu (bao gồm phí vận chuyển)', example: 1750000 })
    totalRevenue: number;

    @ApiProperty({ description: 'Tổng giá trị đơn hàng (không bao gồm phí vận chuyển)', example: 1640000 })
    totalOrderValue: number;

    @ApiProperty({ description: 'Tổng phí vận chuyển', example: 110000 })
    totalShippingFee: number;

    @ApiProperty({ description: 'Tổng số đơn hàng', example: 3 })
    totalOrders: number;
}

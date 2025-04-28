import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpsertInventoryDto } from './dto/upsert.dto';
import { InventoryService } from './inventory.service';

@ApiTags('Quản lý tồn kho')
@Controller('inventory')
export class InventoryController {
    constructor(private readonly service: InventoryService) { }

    @ApiOperation({ summary: 'Lấy tất cả thông tin tồn kho' })
    @ApiResponse({
        status: 200,
        description: 'Danh sách tồn kho',
    })
    @Get()
    async getAllInventory() {
        return await this.service.getAllInventory();
    }

    @ApiOperation({ summary: 'Lấy thông tin tồn kho theo ID sản phẩm' })
    @ApiParam({ name: 'id', description: 'ID của sản phẩm', type: 'number' })
    @ApiResponse({
        status: 200,
        description: 'Thông tin tồn kho của sản phẩm',
    })
    @Get(':id')
    async getInventoryByProductId(@Param('id') id: number) {
        return await this.service.getInventoryByProductId(id);
    }

    @ApiOperation({ summary: 'Cập nhật thông tin tồn kho' })
    @ApiResponse({
        status: 201,
        description: 'Cập nhật tồn kho thành công',
    })
    @ApiCreatedResponse({
        description: 'Cập nhật tồn kho thành công',
    })
    @Post()
    async upsertInventory(@Body() dto: UpsertInventoryDto) {
        return await this.service.upsertInventory(dto);
    }
}
import { Body, Controller, Delete, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GiftService } from './gift.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { schemaGift } from '../gifts/schema/gift';
import { UpsertGiftDto } from './dto/upsert-gift.dto';

@ApiTags('Gift')
@Controller({
  path: 'gifts',
  version: '1',
})
export class GiftController {
  constructor(private readonly giftService: GiftService) {
  }

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: schemaGift
  })
  upsertGift(
    @Body() createGiftDto: UpsertGiftDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.giftService.upsertGift(createGiftDto, images);
  }
  @Get('name')
  @ApiQuery({
    name: 'name',
    description: 'Gift name',
    required: false,
    type: 'string',
  })
  getGiftByName(@Query('name') name: string) {
    return this.giftService.findByName(name);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'Gift ID',
    required: true,
    type: String,
  })
  getGiftById(@Param('id') id: string) {
    return this.giftService.findById(id);
  }
  @Get('category/:category')
  @ApiParam({
    name: 'category',
    description: 'Gift category',
    required: false,
    type: 'string',
  })
  getGiftByCategory(@Param() category: string) {
    return this.giftService.findByCategory(category);
  }

  @Get()
  getGifts() {
    return this.giftService.findAll();
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'Gift ID',
    required: true,
    type: String,
  })
  deleteGift(@Param('id') id: string) {
    return this.giftService.remove(id);
  }



}

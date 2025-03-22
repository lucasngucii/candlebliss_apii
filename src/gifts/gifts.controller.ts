import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { GiftsService } from './gifts.service';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { Gifts } from './domain/gift';
import { CreateGiftsDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { schemaGift } from './schema/gift';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Gift')
@Controller({
  path: 'gifts',
  version: '1',
})
export class GiftsController {
  constructor(private readonly service: GiftsService) {}

  @Roles(RoleEnum.admin)
  @ApiCreatedResponse({
    type: Gifts,
  })
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: schemaGift,
  })
  @Post()
  create(
    @Body() createGiftDto: CreateGiftsDto,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<Gifts> {
    console.log(createGiftDto);

    return this.service.create(createGiftDto, images);
  }

  @Roles(RoleEnum.admin)
  @ApiCreatedResponse({
    type: Gifts,
  })
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    type: 'string',
    name: 'id',
    description: 'The ID of the gift',
  })
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiBody({
    schema: schemaGift,
  })
  update(
    @Param('id') id: Gifts['id'],
    @Body() updateGiftDto: UpdateGiftDto,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<Gifts> {
    return this.service.update(id, updateGiftDto, images);
  }
}

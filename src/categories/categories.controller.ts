import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './domain/category';
import { RolesGuard } from '../roles/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @ApiCreatedResponse({
    type: Category,
  })
  @HttpCode(HttpStatus.CREATED)
  @SerializeOptions({
    groups: ['admin'],
  })
  @Roles(RoleEnum.admin)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.service.create(createCategoryDto);
  }

  @ApiCreatedResponse({
    type: Category,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the category',
  })
  @HttpCode(HttpStatus.CREATED)
  @SerializeOptions({
    groups: ['admin'],
  })
  @Roles(RoleEnum.admin)
  @Patch(':id')
  update(
    @Param('id') id: Category['id'],
    @Body() createCategoryDto: UpdateCategoryDto,
  ) {
    return this.service.update(id, createCategoryDto);
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @SerializeOptions({
    groups: ['admin'],
  })
  @Roles(RoleEnum.admin)
  @Delete(':id')
  remove(@Param('id') id: Category['id']) {
    return this.service.remove(id);
  }

  @ApiCreatedResponse({
    type: [Category],
  })
  @HttpCode(HttpStatus.FOUND)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiCreatedResponse({
    type: Category,
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'The ID of the category',
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id') id: Category['id']) {
    return this.service.findById(id);
  }

  @ApiCreatedResponse({
    type: Category,
  })
  @ApiQuery({
    name: 'name',
    type: String,
    description: 'The name of the category',
  })
  @Get('name')
  @HttpCode(HttpStatus.OK)
  findByName(@Query('name') name: Category['name']) {
    return this.service.findByName(name);
  }

  @ApiCreatedResponse({
    type: [Category],
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'The maximum number of categories to return',
  })
  @Get('top')
  @HttpCode(HttpStatus.OK)
  findTop(@Query('limit') limit: number) {
    return this.service.findTop(limit);
  }
}

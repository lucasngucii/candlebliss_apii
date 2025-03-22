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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AddressService } from './address.service';
import { Address } from './domain/address';
import { CreateAddressDto } from './dto/create-address.dto';
import { NullableType } from '../utils/types/nullable.type';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller({ path: 'address', version: '1' })
@ApiBearerAuth()
@ApiTags('Address')
export class AddressController {
  constructor(private readonly service: AddressService) {}

  @ApiCreatedResponse({
    type: Address,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAddressDto: CreateAddressDto): Promise<Address> {
    return this.service.create(createAddressDto);
  }

  @ApiOkResponse({
    type: Address,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  findById(@Param('id') id: Address['id']): Promise<NullableType<Address>> {
    return this.service.findById(id);
  }

  @ApiOkResponse({
    type: Address,
  })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: Number,
    required: true,
  })
  @Patch(':id')
  update(
    @Param('id') id: Address['id'],
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Address | null> {
    return this.service.update(id, updateAddressDto);
  }

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: Address['id']): Promise<void> {
    return this.service.remove(id);
  }
}

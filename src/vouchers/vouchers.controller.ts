import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from '../roles/roles.guard';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { Vouchers } from './domain/voucher';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { UpdateVoucherDto } from './dto/update-voucher.dto';

@ApiTags('vouchers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'vouchers', version: '1' })
export class VouchersController {
  constructor(private readonly service: VouchersService) {}

  @ApiCreatedResponse({
    type: Vouchers,
  })
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @Post()
  create(@Body() createVoucherDto: CreateVoucherDto) {
    return this.service.create(createVoucherDto);
  }

  @ApiCreatedResponse({
    type: Vouchers,
  })
  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @Patch(':id')
  update(
    @Param('id') id: Vouchers['id'],
    @Body() updateVoucherDto: UpdateVoucherDto,
  ) {
    return this.service.update(id, updateVoucherDto);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @Patch(':id/active')
  setActive(@Param('id') id: Vouchers['id']) {
    return this.service.setActive(id);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @Patch(':id/inactive')
  setInactive(@Param('id') id: Vouchers['id']) {
    return this.service.setInactive(id);
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @Delete(':id/remove')
  remove(@Param('id') id: Vouchers['id']) {
    return this.service.remove(id);
  }

  @ApiBearerAuth()
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @Get(':id')
  findOneById(@Param('id') id: Vouchers['id']) {
    return this.service.findById(id);
  }

  @ApiBearerAuth()
  @ApiParam({
    name: 'code',
    type: String,
    required: true,
  })
  @Get('code/:code')
  findByCode(@Param('code') code: Vouchers['code']) {
    return this.service.findByCode(code);
  }

  //   @ApiBearerAuth()
  //   @ApiQuery({
  //     name: 'codes',
  //     type: [String],
  //     required: true,
  //     isArray: true,
  //   })
  //   @Get('codes')
  //   findByCodes(@Query('codes') codes: Vouchers['code'][]) {
  //     return this.service.findByCodes(codes);
  //   }

  //   @ApiBearerAuth()
  //   @ApiQuery({
  //     name: 'ids',
  //     type: String,
  //     required: true,
  //   })
  //   @Get('ids')
  //   findVouchersByIds(@Query('ids') ids: string) {
  //     const idQuery = ids.split(',').map((id) => Number(id));
  //     return this.service.findVouchersByIds(idQuery);
  //   }

  @ApiBearerAuth()
  @Get('date')
  filterByDate(
    @Param('start_date') start_date: Vouchers['start_date'],
    @Param('end_date') end_date: Vouchers['end_date'],
  ) {
    return this.service.filterByDate(start_date, end_date);
  }

  @ApiBearerAuth()
  @Get('active')
  findAllIsActive(@Param('isActive') isActive: Vouchers['isActive']) {
    return this.service.findAllIsActive(isActive);
  }
}

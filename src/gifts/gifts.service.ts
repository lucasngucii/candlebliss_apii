import { Injectable } from '@nestjs/common';
import { QueriesGiftService } from './infrastruture/persistence/queries/gift';
import { CommandGiftsService } from './infrastruture/persistence/commands/gift';
import { CreateGiftsDto } from './dto/create-gift.dto';
import { Gifts } from './domain/gift';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { ProductDetail } from '../products/domain/product-detail';

@Injectable()
export class GiftsService {
  constructor(
    private readonly queries: QueriesGiftService,
    private readonly command: CommandGiftsService,
  ) {}

  create(
    createGiftDto: CreateGiftsDto,
    images: Express.Multer.File[],
  ): Promise<Gifts> {
    return this.command.create(createGiftDto, images);
  }

  update(
    id: Gifts['id'],
    payload: UpdateGiftDto,
    imagesDto: Express.Multer.File[],
  ): Promise<Gifts> {
    return this.command.update(id, payload, imagesDto);
  }

  remove(id: Gifts['id']): Promise<void> {
    return this.command.remove(id);
  }

  findById(id: Gifts['id']): Promise<Gifts> {
    return this.queries.findById(id);
  }

  findAll(): Promise<Gifts[]> {
    return this.queries.findAll();
  }

  findGiftsByProductDetails(detailId: ProductDetail['id'][]): Promise<Gifts[]> {
    return this.queries.findGiftsByProductDetails(detailId);
  }

  findByName(name: Gifts['name']): Promise<Gifts> {
    return this.queries.findByName(name);
  }
}

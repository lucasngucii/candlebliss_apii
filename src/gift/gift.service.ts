import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpsertGiftDto } from './dto/upsert-gift.dto';
import { ImagesService } from '../images/images.service';
import { EntityManager } from 'typeorm';
import { Image } from '../images/domain/image';

@Injectable()
export class GiftService {

  constructor(
    private readonly imagesSerivce: ImagesService,
    private readonly entityMgr: EntityManager
  ) {

  }
  // Define your service methods here
  async upsertGift(createGiftDto: UpsertGiftDto, imagesDto: Express.Multer.File[]) {
    try {
      return await this.entityMgr.transaction(async (transactionalEntityManager) => {
        let images: Image[] = [];
        if (imagesDto?.length) {
          images = await this.imagesSerivce.uploadCloudImages(imagesDto);
        }
        const giftId = createGiftDto.id;
        await transactionalEntityManager.query(
        `INSERT INTO gifts (id, name, description, video, base_price, discount_price, start_date, end_date, images)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
         name = $2,
         description = $3,
         video = $4,
         base_price = $5,
         discount_price = $6,
         start_date = $7,
         end_date = $8,
         images = $9
        `,
        [
          giftId,
          createGiftDto.name,
          createGiftDto.description || null,
          createGiftDto.video || null,
          createGiftDto.base_price,
          createGiftDto.discount_price,
          createGiftDto.start_date,
          createGiftDto.end_date,
          JSON.stringify(images),
        ]
      );
        await transactionalEntityManager.query(
          `UPDATE gifts SET products = $1 WHERE id = $2`,
          [JSON.stringify(createGiftDto.products), giftId]
        );

        const giftResult = await transactionalEntityManager.query(
          `SELECT * FROM gifts WHERE id = $1`,
          [giftId]
        );

        if (!giftResult.length) {
          throw new BadRequestException('Failed to retrieve updated gift');
        }
        const gift = giftResult[0];

        return gift;

      })
    } catch (error) {
      console.error('Error in upsertGift:', error);
      throw new BadRequestException('Error processing gift data');
    }
  }

  async findAll() {
    return await this.entityMgr.query('SELECT * FROM gifts');
  }

  async findById(id: string) {
    try {
      const gift = await this.entityMgr.query(`
        SELECT * FROM gifts WHERE id = $1
      `, [id]);
      

      if (!gift) {
        throw new NotFoundException('Gift not found');
      }
      return gift;
    } catch (error) {
      console.error('Error in findById:', error);
      throw new BadRequestException('Error retrieving gift by ID');
    }
  }

  async remove(id: string) {
    const gift = await this.entityMgr.query(
      `DELETE FROM gifts WHERE id = $1 RETURNING *`,
      [id]
    );
    if (!gift.length) {
      throw new BadRequestException('Gift not found');
    }
    return gift[0];
  }

  async findByName(name: string) {
    const gift = await this.entityMgr.query(
      `SELECT * FROM gifts WHERE name ILIKE $1`,
      [`%${name}%`]
    );

    if (!gift.length) {
      throw new BadRequestException('Gift not found');
    }

    return gift;
  }

  async findByCategory(category: string) {
    const gift = await this.entityMgr.query(
      `SELECT * FROM gifts WHERE category = $1`,
      [category]
    );

    if (!gift.length) {
      throw new BadRequestException('Gift not found');
    }

    return gift;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { ImageRepository } from '../image.repository';
import { Image } from '../../../domain/image';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from '../entity/image.entity';
import { In, Repository } from 'typeorm';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class ImageRelationalRepository implements ImageRepository {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
  ) {}
  async create(data: Omit<Image, 'id'>): Promise<Image> {
    const entity = this.imageRepository.create({ ...data });
    return this.imageRepository.save(entity);
  }
  async findById(id: Image['id']): Promise<NullableType<Image>> {
    const entity = await this.imageRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) {
      throw new NotFoundException(`Image ${id} not found`);
    }
    return entity;
  }
  async findByIds(ids: Image['id'][]): Promise<NullableType<Image>[]> {
    const entities = await this.imageRepository.find({
      where: { id: In(ids), isDeleted: false },
    });
    if (entities.length === 0) {
      throw new NotFoundException(`Images ${ids.join(', ')} not found`);
    }
    return entities;
  }
  async update(id: Image['id'], payload: Partial<Image>): Promise<Image> {
    const entity = await this.imageRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) {
      throw new NotFoundException(`Image ${id} not found`);
    }

    const updateEntity = this.imageRepository.create({
      ...entity,
      ...payload,
    });
    return this.imageRepository.save(updateEntity);
  }
  async remove(id: Image['id']): Promise<void> {
    const entity = await this.imageRepository.findOne({ where: { id } });
    if (!entity) {
      throw new NotFoundException(`Image ${id} not found`);
    }
    entity.isDeleted = true;
    entity.deletedAt = new Date();
    await this.imageRepository.save(entity);
  }
  async findImagesByPublicIds(publicIds: string[]): Promise<Image[]> {
    const entity = await this.imageRepository.find({
      where: { public_id: In(publicIds), isDeleted: false },
    });
    if (!entity) {
      throw new NotFoundException(
        `Images with public ids ${publicIds.join(', ')} not found`,
      );
    }
    return entity;
  }
}

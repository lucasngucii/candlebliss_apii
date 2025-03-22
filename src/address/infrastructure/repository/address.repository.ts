import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressRepository } from '../address.repository';
import { Address } from '../../domain/address';
import { InjectRepository } from '@nestjs/typeorm';
import { NullableType } from 'src/utils/types/nullable.type';
import { AddressEntity } from '../entities/address.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class AddressRelationalRepository implements AddressRepository {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async create(data: Address): Promise<Address> {
    const user = await this.userRepository.findOne({
      where: { id: data.userId },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const entity = this.addressRepository.create({
      province: data.province,
      district: data.district,
      ward: data.ward,
      street: data.street,
      user,
    });
    return await this.addressRepository.save(entity);
  }
  async findById(id: Address['id']): Promise<Address | null> {
    return await this.addressRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['user'],
    });
  }
  async update(
    id: Address['id'],
    payload: Partial<Address>,
  ): Promise<NullableType<Address>> {
    const entity = await this.addressRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['user'],
    });

    if (!entity) return null;

    Object.assign(entity, payload);
    await this.addressRepository.save(entity);
    return this.findById(id);
  }
  async remove(id: Address['id']): Promise<void> {
    const entity = await this.addressRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!entity) return;
    entity.isDeleted = true;
    await this.addressRepository.save(entity);
  }
  async findManyByUserId(userId: number): Promise<Address[]> {
    return await this.addressRepository.find({
      where: { user: { id: userId }, isDeleted: false },
      relations: ['user'],
    });
  }
}

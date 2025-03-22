import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { AddressRepository } from './infrastructure/address.repository';

import { Address } from './domain/address';
import { UpdateAddressDto } from './dto/update-address.dto';
import { User } from '../users/domain/user';

@Injectable()
export class AddressService {
  constructor(private readonly addressRepository: AddressRepository) {}
  async create(dto: CreateAddressDto): Promise<Address> {
    const address = await this.addressRepository.create(dto);
    return address;
  }

  async update(id: Address['id'], dto: UpdateAddressDto): Promise<Address> {
    const updatedAddress = await this.addressRepository.update(id, dto);
    if (!updatedAddress) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }
    return updatedAddress;
  }

  async remove(id: Address['id']): Promise<void> {
    await this.addressRepository.remove(id);
  }

  async findById(id: Address['id']): Promise<Address> {
    const address = await this.addressRepository.findById(id);
    if (!address) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }
    return address;
  }

  async findManyByUserId(id: User['id']): Promise<Address[]> {
    const addresses = await this.addressRepository.findManyByUserId(id);
    if (!addresses) {
      throw new NotFoundException(`Addresses not found for user with id ${id}`);
    }
    return addresses;
  }
}

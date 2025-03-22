import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from './persistence/entity/image.entity';
import { ImageRepository } from './persistence/image.repository';
import { ImageRelationalRepository } from './persistence/repository/image.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ImageEntity])],
  providers: [
    {
      provide: ImageRepository,
      useClass: ImageRelationalRepository,
    },
  ],
  exports: [ImageRepository],
})
export class RelationalImagePersistenceModule {}

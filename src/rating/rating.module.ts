import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingEntity } from './entity/rating.entity';


@Module({
  imports: [TypeOrmModule.forFeature([RatingEntity])],
  controllers: [RatingController],
  providers: [RatingService],
  exports: [RatingService],
})
export class RatingModule { }

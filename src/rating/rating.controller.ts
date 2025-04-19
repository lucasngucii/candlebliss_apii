import { Body, Controller, Post } from '@nestjs/common';
import { RatingService } from './rating.service';
import { UpsertRatingDto } from './dto/upsert.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { QueryRatingByProductDto } from './dto/query.dto';

@Controller('rating')
export class RatingController {
    constructor(private readonly ratingService: RatingService) {

    }

    @ApiCreatedResponse({
        description: 'Rating upserted successfully',
    })
    @Post('upsert')
    async upsertRating(@Body() dto: UpsertRatingDto) {
        return await this.ratingService.upsertRating(dto);
    }

    @Post('get-by-product')
    async getRatingByProduct(@Body() dto: QueryRatingByProductDto) {
        return await this.ratingService.getRatingByProduct(dto);
    }
    

}

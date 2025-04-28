import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RatingEntity } from './entity/rating.entity';
import { EntityManager, Repository } from 'typeorm';
import { UpsertRatingDto } from './dto/upsert.dto';
import { QueryRatingByProductDto } from './dto/query.dto';
import { OrdersEntity, OrderStatus } from '../orders/entity/order.entity';

@Injectable()
export class RatingService {
    constructor(
        @InjectRepository(RatingEntity)
        private readonly ratingRepository: Repository<RatingEntity>,
        private readonly entityManager: EntityManager,
    ) { }

    async upsertRating(dto: UpsertRatingDto): Promise<RatingEntity | undefined> {
        try {
            const order = await this.entityManager.findOne(OrdersEntity, {
                where: {
                    id: dto.order_id,
                    user_id: dto.user_id,
                    status: OrderStatus.COMPLETED
                },
                relations: ['item'],
            }
            )
            if (!order) {
                Logger.warn('Order not found or not completed:', dto.order_id);
                return undefined;
            }


            if (order.item && Array.isArray(order.item)) {
                for (const item of order.item) {
                    await this.entityManager.query(
                        `
                        INSERT INTO rating (product_id, user_id, comment, rating)
                        VALUES ($1, $2, $3, $4)
                        ON CONFLICT (product_id, user_id)
                        DO UPDATE SET
                            comment = EXCLUDED.comment,
                            rating = EXCLUDED.rating
                        `,
                        [item.product_id, dto.user_id, dto.comment, dto.rating]
                    );
                }

                await this.entityManager.query(`
                    INSERT INTO rating (order_id, user_id, comment, rating)
                        VALUES ($1, $2, $3, $4)
                        ON CONFLICT (order_id, user_id)
                        DO UPDATE SET
                            comment = EXCLUDED.comment,
                            rating = EXCLUDED.rating
                `, [order.id, dto.user_id, dto.comment, dto.rating]);
            }

            const rs = await this.ratingRepository.query(`
                SELECT * FROM rating r
                WHERE r.order_id = $1
                AND r.user_id = $2
                `, [order.id, dto.user_id]);
            return rs;
        } catch (error) {
            Logger.error('Error upserting rating:', error);
            return undefined;
        }
    }

    async getRatingByProduct(productId: QueryRatingByProductDto): Promise<RatingEntity[]> {
        try {
            const rating = await this.ratingRepository.query(`
                SELECT 
                    r.id, 
                    r.user_id, 
                    r.comment, 
                    r.rating,
                    avg_sub.avg_rating
                    FROM rating r
                INNER JOIN (
                    SELECT product_id, AVG(rating) AS avg_rating
                    FROM rating
                    WHERE product_id = $1
                    GROUP BY product_id
                ) AS avg_sub ON r.product_id = avg_sub.product_id
                WHERE r.product_id = $1
                ORDER BY r.rating DESC
            `, [productId.product_id]);
            return rating;
        } catch (error) {
            Logger.error('Error fetching ratings:', error);
            return [];
        }
    }
}

import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('rating')
export class RatingEntity {
    @PrimaryColumn()
    id: number;

    @Column({ type: 'int', nullable: true })
    product_id: number;

    @Column({ type: 'int', nullable: true })
    order_id: number;

    @Column({ type: 'int', nullable: true })
    user_id: number

    @Column({ type: String, nullable: true })
    comment: string;

    @Column({ type: 'float', nullable: true })
    rating: number;
}
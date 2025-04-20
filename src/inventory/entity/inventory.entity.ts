import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum InventoryStatus {
    INCREASE = 'increase',
    DECREASE = 'decrease',
}
@Entity('inventory')
export class InventoryEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: 'int', nullable: true })
    product_detail_id: number;

    @Column({ type: 'int', nullable: true })
    quantity: number;

    @Column({ type: 'enum', enum: InventoryStatus, default: InventoryStatus.INCREASE })
    status: InventoryStatus;

    @Column({ type: 'varchar', nullable: true })
    update_by: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
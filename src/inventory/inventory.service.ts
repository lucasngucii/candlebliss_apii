import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UpsertDto, UpsertInventoryDto } from './dto/upsert.dto';
import { InventoryStatus } from './entity/inventory.entity';

interface InventoryUpdate {
    product_detail_id: number;
    quantity: number;
    status: InventoryStatus;
}
@Injectable()
export class InventoryService {

    constructor(
        private readonly entityManager: EntityManager
    ) { }

    async getInventoryByProductId(product_id: number): Promise<any> {
        try {
            const inventory = await this.entityManager.query(`
                SELECT * FROM inventory WHERE product_detail_id = $1
            `, [product_id]);
            return inventory;
        }
        catch (error) {
            throw new BadRequestException(`Lỗi khi lấy thông tin tồn kho theo ID sản phẩm: ${error.message}`);
        }
    }

    async getAllInventory(): Promise<any> {
        try {
            const inventories = await this.entityManager.query(`
                SELECT * FROM inventory
            `);
            return inventories;
        }
        catch (error) {
            throw new BadRequestException(`Lỗi khi lấy tất cả thông tin tồn kho: ${error.message}`);
        }
    }

    async upsertInventory(dto: UpsertInventoryDto): Promise<any> {
        try {
            return await this.entityManager.transaction(async (transactionManager) => {
                const { upsert_products, update_by } = dto;
                const inventoryUpdates: InventoryUpdate[] = [];
                if (upsert_products && Array.isArray(upsert_products)) {
                    for (const product of upsert_products) {
                        await this.upsertProductToInventory(product, update_by);
                        const { product_detail_id, quantity } = product;
                        inventoryUpdates.push({
                            product_detail_id: product_detail_id,
                            quantity: quantity,
                            status: product.status,
                        });
                    }
                    await this.updateInventory(inventoryUpdates, transactionManager);
                    return {
                        message: 'Cập nhật tồn kho thành công',
                        data: upsert_products,
                    };
                }
            })

        } catch (error) {
            throw new BadRequestException(`Lỗi khi cập nhật tồn kho: ${error.message}`);
        }
    }

    private async upsertProductToInventory(dto: UpsertDto, update_by: string): Promise<void> {
        try {
            const { product_detail_id, quantity, status } = dto;
            const et = await this.entityManager.query(`
                INSERT INTO inventory (product_detail_id, quantity, status, update_by)
                VALUES ($1, $2, $3, $4)
            `, [product_detail_id, quantity, status, update_by]);
            return et;
        } catch (error) {
            throw new BadRequestException(`Lỗi khi cập nhật sản phẩm vào tồn kho: ${error.message}`);
        }
    }

    private async updateInventory(
        updates: InventoryUpdate[],
        transactionManager: EntityManager,
    ): Promise<void> {
        for (const update of updates) {
            const productDetail = await transactionManager.query(
                `SELECT * FROM product_detail WHERE id = $1`,
                [update.product_detail_id]
            )
            if (!productDetail || productDetail.length === 0) {
                throw new BadRequestException(`Không tìm thấy sản phẩm với ID: ${update.product_detail_id}`);
            }

            if (update.status === InventoryStatus.DECREASE && productDetail[0].quantities < update.quantity) {
                throw new BadRequestException(
                    `Số lượng trong kho không đủ cho sản phẩm với ID: ${update.product_detail_id}. Hiện có: ${productDetail[0].quantities}, Cần giảm: ${update.quantity}`
                );
            }

            const changeValue = update.status === InventoryStatus.INCREASE
                ? update.quantity
                : -update.quantity;

            const updatepd  = Number(productDetail[0].quantities) + changeValue;

            await transactionManager.query(`
                UPDATE product_detail
                SET quantities = $1
                WHERE id = $2
            `, [updatepd, update.product_detail_id]);

        }
    }
}
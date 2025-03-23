import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from './entity/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    private readonly entityManager: EntityManager,
  ) {}

  async createCart(createCartDto: CreateCartDto) {
    return this.cartRepository.save(
      this.cartRepository.create({ ...createCartDto }),
    );
  }

  /**
   * Upserts a cart item in the shopping cart based on the given product and quantity.
   *
   * - If the product does not exist in the cart:
   *   - Inserts a new item if quantity > 0.
   * - If the product already exists:
   *   - Updates the quantity and total price if quantity is different and > 0.
   *   - Deletes the item if quantity is 0.
   * - If the product exists with the same quantity → no action.
   *
   * This operation uses a single SQL query for insert/update/delete to optimize performance.
   *
   * @param cartId - The ID of the cart to which the item belongs.
   * @param productId - The ID of the product detail to be added/updated in the cart.
   * @param quantity - The desired quantity for the product:
   *   - 0: removes the item from the cart if it exists.
   *   - > 0: adds or updates the item to match this quantity.
   *
   * @returns The full updated cart, including cart items and aggregated totals.
   *
   * @throws NotFoundException - If the product detail or price cannot be found.
   */
  async upsertCartItem(cartId: number, productId: number, quantity: number) {
    const [productDetail] = await this.entityManager.query(
      `
      SELECT p.id
      FROM product_detail as p
      WHERE id = $1
    `,
      [productId],
    );

    if (!productDetail) {
      throw new NotFoundException('product detail not found');
    }

    const price = await this.getPrice(productId);

    await this.entityManager.query(
      `
      WITH existing AS (
        SELECT quantity FROM cart_item
        WHERE "cartId" = $1 AND "productDetailId" = $2
      ),
      deleted AS (
        DELETE FROM cart_item
        WHERE "cartId" = $1 AND "productDetailId" = $2 AND $3 = 0
        RETURNING id, "cartId", "productDetailId", quantity, "totalPrice", 'deleted' AS status
      ),
      updated AS (
        UPDATE cart_item
        SET quantity = $3,
            "totalPrice" = $3 * $4
        WHERE "cartId" = $1 AND "productDetailId" = $2
          AND EXISTS (SELECT 1 FROM existing)
          AND (SELECT quantity FROM existing) <> $3
          AND $3 > 0
        RETURNING id, "cartId", "productDetailId", quantity, "totalPrice", 'updated' AS status
      ),
      inserted AS (
        INSERT INTO cart_item ("cartId", "productDetailId", quantity, "totalPrice")
        SELECT $1, $2, $3, $3 * $4
        WHERE NOT EXISTS (SELECT 1 FROM existing)
          AND $3 > 0
        RETURNING id, "cartId", "productDetailId", quantity, "totalPrice", 'inserted' AS status
      )
      SELECT * FROM deleted
      UNION ALL
      SELECT * FROM updated
      UNION ALL
      SELECT * FROM inserted
      `,
      [cartId, productId, quantity, price],
    );

    return this.getCartById(cartId);
  }

  private async getPrice(productId: number) {
    const [priceRow] = await this.entityManager.query(
      `
      SELECT COALESCE(pr.discount_price, pr.base_price) AS price
      FROM prices pr
      WHERE pr.id = $1
      LIMIT 1
      `,
      [productId],
    );

    if (!priceRow) {
      throw new NotFoundException(`priceNotFound`);
    }

    return Number(priceRow.price);
  }
  async getCartById(cartId: number) {
    const result = await this.cartRepository.query(
      `
      SELECT 
        c.id,
        c."userId",
        c.status,
        c."totalPrice" AS "originalTotalPrice",
        c."totalQuantity" AS "originalTotalQuantity",
        c."createdAt",
        c."updatedAt",
        COALESCE(ci_data."cartItems", '[]') AS "cartItems",
        COALESCE(ci_data."totalQuantity", 0) AS "totalQuantity",
        COALESCE(ci_data."totalPrice", 0) AS "totalPrice"
      FROM cart c
      LEFT JOIN (
        SELECT 
          ci."cartId",
          json_agg(ci ORDER BY ci.id) AS "cartItems",
          SUM(ci.quantity) AS "totalQuantity",
          SUM(ci."totalPrice") AS "totalPrice"
        FROM cart_item ci
        GROUP BY ci."cartId"
      ) ci_data ON ci_data."cartId" = c.id
      WHERE c.id = $1
      `,
      [cartId],
    );

    return result[0];
  }

  async getCartByUserId(userId: number) {
    const result = await this.cartRepository.query(
      `
      SELECT 
        c.id,
        c."userId",
        c.status,
        c."totalPrice" AS "originalTotalPrice",
        c."totalQuantity" AS "originalTotalQuantity",
        c."createdAt",
        c."updatedAt",
        COALESCE(ci_data."cartItems", '[]') AS "cartItems",
        COALESCE(ci_data."totalQuantity", 0) AS "totalQuantity",
        COALESCE(ci_data."totalPrice", 0) AS "totalPrice"
      FROM cart c
      LEFT JOIN (
        SELECT 
          ci."cartId",
          json_agg(ci ORDER BY ci.id) AS "cartItems",
          SUM(ci.quantity) AS "totalQuantity",
          SUM(ci."totalPrice") AS "totalPrice"
        FROM cart_item ci
        GROUP BY ci."cartId"
      ) ci_data ON ci_data."cartId" = c.id
      WHERE c."userId" = $1
      `,
      [userId],
    );

    return result[0];
  }
}

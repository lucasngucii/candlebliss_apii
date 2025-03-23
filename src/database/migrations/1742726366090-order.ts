import { MigrationInterface, QueryRunner } from 'typeorm';

export class Order1742726366090 implements MigrationInterface {
  name = 'Order1742726366090';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "FK_7f05d97bef35db4f1f4b2f8c412"`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_item" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "status" character varying NOT NULL, "productDetailId" integer, "quantity" integer NOT NULL, "totalPrice" numeric NOT NULL, "orderId" integer, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('Đã đặt hàng', 'Đang xử lý', 'Đang giao hàng', 'Hoàn thành', 'Đã huỷ', 'Đổi trả hàng', 'Trả hàng/hoàn tiền')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "user_id" integer NOT NULL, "status" "public"."orders_status_enum" NOT NULL, "address" character varying, "total_quantity" integer, "total_price" numeric, "discount" numeric, "ship_price" numeric, "method_payment" character varying, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE SEQUENCE IF NOT EXISTS "cart_item_id_seq" OWNED BY "cart_item"."id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ALTER COLUMN "id" SET DEFAULT nextval('"cart_item_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ALTER COLUMN "productDetailId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "FK_29e590514f9941296f3a2440d39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ALTER COLUMN "productDetailId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ALTER COLUMN "id" SET DEFAULT nextval('"cart-item_id_seq"')`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(`DROP SEQUENCE "cart_item_id_seq"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    await queryRunner.query(`DROP TABLE "order_item"`);
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_7f05d97bef35db4f1f4b2f8c412" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

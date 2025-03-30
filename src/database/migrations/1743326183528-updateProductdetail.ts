import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductdetail1743326183528 implements MigrationInterface {
  name = 'UpdateProductdetail1743326183528';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_detail" ADD "values" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."orders_status_enum" RENAME TO "orders_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('Đơn hàng vừa được tạo', 'Đang chờ thanh toán', 'Thanh toán thất bại', 'Thanh toán thành công', 'Đang xử lý', 'Đang giao hàng', 'Đã đặt hàng', 'Hoàn thành', 'Đã huỷ', 'Đổi trả hàng')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum" USING "status"::"text"::"public"."orders_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'Đang xử lý'`,
    );
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum_old" AS ENUM('Đơn hàng vừa được tạo', 'Đang chờ thanh toán', 'Thanh toán thất bại', 'Thanh toán thành công', 'Đang xử lý', 'Đang giao hàng', 'Đã đặt hàng', 'Hoàn thành', 'Đã huỷ', 'Đổi trả hàng', 'Trả hàng/hoàn tiền')`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum_old" USING "status"::"text"::"public"."orders_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'Đang xử lý'`,
    );
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."orders_status_enum_old" RENAME TO "orders_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_detail" DROP COLUMN "values"`,
    );
  }
}

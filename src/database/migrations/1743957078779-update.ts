import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1743957078779 implements MigrationInterface {
  name = 'Update1743957078779';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD "unit_price" numeric DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ALTER COLUMN "quantity" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."orders_status_enum" RENAME TO "orders_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('Đơn hàng vừa được tạo', 'Đang chờ thanh toán', 'Thanh toán thất bại', 'Thanh toán thành công', 'Đang chờ hoàn tiền', 'Hoàn tiền thành công', 'Hoàn tiền thất bại', 'Đang xử lý', 'Đang giao hàng', 'Đã đặt hàng', 'Hoàn thành', 'Đã huỷ', 'Đổi trả hàng')`,
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
      `CREATE TYPE "public"."orders_status_enum_old" AS ENUM('Đơn hàng vừa được tạo', 'Đang chờ thanh toán', 'Thanh toán thất bại', 'Thanh toán thành công', 'Đang xử lý', 'Đang giao hàng', 'Đã đặt hàng', 'Hoàn thành', 'Đã huỷ', 'Đổi trả hàng')`,
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
      `ALTER TABLE "order_item" ALTER COLUMN "quantity" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP COLUMN "unit_price"`,
    );
  }
}

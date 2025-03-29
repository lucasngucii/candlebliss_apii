import { MigrationInterface, QueryRunner } from "typeorm";

export class Updatecategory1743240045978 implements MigrationInterface {
    name = 'Updatecategory1743240045978'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_40b29caafc0bbdf6d98a3ad2e41"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "productId"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "category_id" integer`);
        await queryRunner.query(`ALTER TYPE "public"."orders_status_enum" RENAME TO "orders_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('Đơn hàng vừa được tạo', 'Đang chờ thanh toán', 'Thanh toán thất bại', 'Thanh toán thành công', 'Đang xử lý', 'Đang giao hàng', 'Đã đặt hàng', 'Hoàn thành', 'Đã huỷ', 'Đổi trả hàng', 'Trả hàng/hoàn tiền')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum" USING "status"::"text"::"public"."orders_status_enum"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'Đang xử lý'`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum_old" AS ENUM('Đã đặt hàng', 'Đang xử lý', 'Đang giao hàng', 'Hoàn thành', 'Đã huỷ', 'Đổi trả hàng', 'Trả hàng/hoàn tiền')`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" TYPE "public"."orders_status_enum_old" USING "status"::"text"::"public"."orders_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'Đang xử lý'`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."orders_status_enum_old" RENAME TO "orders_status_enum"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "category_id"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "productId" integer`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_40b29caafc0bbdf6d98a3ad2e41" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

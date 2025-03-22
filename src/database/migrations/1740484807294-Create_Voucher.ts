import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVoucher1740484807294 implements MigrationInterface {
  name = 'CreateVoucher1740484807294';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."vouchers_voucher_type_enum" AS ENUM('amount_off', 'percent_off')`,
    );
    await queryRunner.query(
      `CREATE TABLE "vouchers" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "code" character varying NOT NULL, "description" character varying DEFAULT '', "voucher_type" "public"."vouchers_voucher_type_enum" NOT NULL, "voucher_value" numeric(10,2) NOT NULL, "min_order_value" numeric(10,2), "max_voucher_amount" numeric(10,2), "usage_limit" integer NOT NULL, "usage_per_customer" integer, "start_date" TIMESTAMP NOT NULL DEFAULT now(), "end_date" TIMESTAMP NOT NULL DEFAULT now(), "applicable_categories" text, "new_customers_only" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_efc30b2b9169e05e0e1e19d6dd6" UNIQUE ("code"), CONSTRAINT "PK_ed1b7dd909a696560763acdbc04" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_efc30b2b9169e05e0e1e19d6dd" ON "vouchers" ("code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "vouchers_applicable_products_product" ("vouchersId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_03499adbda4bb5c8e33b7a53df6" PRIMARY KEY ("vouchersId", "productId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c4c81308b7bb784bab9b847503" ON "vouchers_applicable_products_product" ("vouchersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_96fad0f1d65e84241b3dd61e59" ON "vouchers_applicable_products_product" ("productId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers_applicable_products_product" ADD CONSTRAINT "FK_c4c81308b7bb784bab9b847503d" FOREIGN KEY ("vouchersId") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers_applicable_products_product" ADD CONSTRAINT "FK_96fad0f1d65e84241b3dd61e594" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vouchers_applicable_products_product" DROP CONSTRAINT "FK_96fad0f1d65e84241b3dd61e594"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers_applicable_products_product" DROP CONSTRAINT "FK_c4c81308b7bb784bab9b847503d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_96fad0f1d65e84241b3dd61e59"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c4c81308b7bb784bab9b847503"`,
    );
    await queryRunner.query(
      `DROP TABLE "vouchers_applicable_products_product"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_efc30b2b9169e05e0e1e19d6dd"`,
    );
    await queryRunner.query(`DROP TABLE "vouchers"`);
    await queryRunner.query(`DROP TYPE "public"."vouchers_voucher_type_enum"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateVoucher1740548782834 implements MigrationInterface {
  name = 'UpdateVoucher1740548782834';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vouchers" DROP COLUMN "voucher_type"`,
    );
    await queryRunner.query(`DROP TYPE "public"."vouchers_voucher_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "vouchers" DROP COLUMN "voucher_value"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers" ADD "amount_off" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers" ADD "percent_off" numeric(10,2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "vouchers" DROP COLUMN "percent_off"`);
    await queryRunner.query(`ALTER TABLE "vouchers" DROP COLUMN "amount_off"`);
    await queryRunner.query(
      `ALTER TABLE "vouchers" ADD "voucher_value" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."vouchers_voucher_type_enum" AS ENUM('amount_off', 'percent_off')`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers" ADD "voucher_type" "public"."vouchers_voucher_type_enum" NOT NULL`,
    );
  }
}

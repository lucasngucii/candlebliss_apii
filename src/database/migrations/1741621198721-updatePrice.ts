import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePrice1741621198721 implements MigrationInterface {
  name = 'UpdatePrice1741621198721';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "prices" DROP COLUMN "base_price"`);
    await queryRunner.query(
      `ALTER TABLE "prices" ADD "base_price" numeric NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" DROP COLUMN "discount_price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ADD "discount_price" numeric NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prices" DROP COLUMN "discount_price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ADD "discount_price" integer NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "prices" DROP COLUMN "base_price"`);
    await queryRunner.query(
      `ALTER TABLE "prices" ADD "base_price" integer NOT NULL`,
    );
  }
}

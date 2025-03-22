import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductDetail1741160342326 implements MigrationInterface {
  name = 'UpdateProductDetail1741160342326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_detail" ADD "isActive" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_detail" DROP COLUMN "isActive"`,
    );
  }
}

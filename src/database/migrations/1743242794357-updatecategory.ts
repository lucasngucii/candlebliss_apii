import { MigrationInterface, QueryRunner } from 'typeorm';

export class Updatecategory1743242794357 implements MigrationInterface {
  name = 'Updatecategory1743242794357';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_item" RENAME COLUMN "productDetailId" TO "product_detail_id"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_item" RENAME COLUMN "product_detail_id" TO "productDetailId"`,
    );
  }
}

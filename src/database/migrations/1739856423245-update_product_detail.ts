import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductDetail1739856423245 implements MigrationInterface {
  name = 'UpdateProductDetail1739856423245';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "image" ADD "productDetailsId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_86140dee32ed75ce2a6c1694f69" FOREIGN KEY ("productDetailsId") REFERENCES "product_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "image" DROP CONSTRAINT "FK_86140dee32ed75ce2a6c1694f69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" DROP COLUMN "productDetailsId"`,
    );
  }
}

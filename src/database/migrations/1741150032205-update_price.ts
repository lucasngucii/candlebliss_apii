import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatePrice1741150032205 implements MigrationInterface {
  name = 'UpdatePrice1741150032205';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prices" DROP CONSTRAINT "FK_fe932c923ecd4abc3f0ac915736"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" RENAME COLUMN "productId" TO "productDetailId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ADD CONSTRAINT "UQ_af01ab38a73069fbf8255fd6e72" UNIQUE ("productDetailId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ADD CONSTRAINT "FK_af01ab38a73069fbf8255fd6e72" FOREIGN KEY ("productDetailId") REFERENCES "product_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "prices" DROP CONSTRAINT "FK_af01ab38a73069fbf8255fd6e72"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" DROP CONSTRAINT "UQ_af01ab38a73069fbf8255fd6e72"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" RENAME COLUMN "productDetailId" TO "productId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ADD CONSTRAINT "FK_fe932c923ecd4abc3f0ac915736" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

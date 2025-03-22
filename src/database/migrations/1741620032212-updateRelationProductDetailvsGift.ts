import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRelationProductDetailvsGift1741620032212
  implements MigrationInterface
{
  name = 'UpdateRelationProductDetailvsGift1741620032212';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_detail" DROP CONSTRAINT "FK_5e7cb0c89c9f81bb5daba0e3b48"`,
    );
    await queryRunner.query(
      `CREATE TABLE "gift_product_details_product_detail" ("giftId" integer NOT NULL, "productDetailId" integer NOT NULL, CONSTRAINT "PK_338e011885637dee2f3443252b7" PRIMARY KEY ("giftId", "productDetailId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_861d517ab2de2c573412bce5f5" ON "gift_product_details_product_detail" ("giftId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6f8637b98836528108103c89cb" ON "gift_product_details_product_detail" ("productDetailId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product_detail" DROP COLUMN "giftId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gift_product_details_product_detail" ADD CONSTRAINT "FK_861d517ab2de2c573412bce5f5f" FOREIGN KEY ("giftId") REFERENCES "gift"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "gift_product_details_product_detail" ADD CONSTRAINT "FK_6f8637b98836528108103c89cb7" FOREIGN KEY ("productDetailId") REFERENCES "product_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "gift_product_details_product_detail" DROP CONSTRAINT "FK_6f8637b98836528108103c89cb7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gift_product_details_product_detail" DROP CONSTRAINT "FK_861d517ab2de2c573412bce5f5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_detail" ADD "giftId" integer`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6f8637b98836528108103c89cb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_861d517ab2de2c573412bce5f5"`,
    );
    await queryRunner.query(`DROP TABLE "gift_product_details_product_detail"`);
    await queryRunner.query(
      `ALTER TABLE "product_detail" ADD CONSTRAINT "FK_5e7cb0c89c9f81bb5daba0e3b48" FOREIGN KEY ("giftId") REFERENCES "gift"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}

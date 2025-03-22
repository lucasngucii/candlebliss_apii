import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateProductDetail1739784617203 implements MigrationInterface {
  name = 'UpdateProductDetail1739784617203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_detail" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "size" character varying, "type" character varying, "quantities" integer NOT NULL DEFAULT '0', "productId" integer, CONSTRAINT "PK_12ea67a439667df5593ff68fc33" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "size"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "quantities"`);
    await queryRunner.query(
      `ALTER TABLE "product_detail" ADD CONSTRAINT "FK_2c1471f10d59111c8d052b0bdbc" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product_detail" DROP CONSTRAINT "FK_2c1471f10d59111c8d052b0bdbc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD "quantities" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD "type" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD "size" character varying`,
    );
    await queryRunner.query(`DROP TABLE "product_detail"`);
  }
}

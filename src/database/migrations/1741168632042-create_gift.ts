import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGift1741168632042 implements MigrationInterface {
  name = 'CreateGift1741168632042';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "gift" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "name" character varying NOT NULL DEFAULT '', "description" text NOT NULL DEFAULT '', "video" character varying NOT NULL DEFAULT '', "pricesId" integer, CONSTRAINT "REL_880c8d4ed7b282abbeb060b5b9" UNIQUE ("pricesId"), CONSTRAINT "PK_f91217caddc01a085837ebe0606" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_detail" ADD "giftId" integer`,
    );
    await queryRunner.query(`ALTER TABLE "image" ADD "giftId" integer`);
    await queryRunner.query(
      `ALTER TABLE "gift" ADD CONSTRAINT "FK_880c8d4ed7b282abbeb060b5b91" FOREIGN KEY ("pricesId") REFERENCES "prices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_detail" ADD CONSTRAINT "FK_5e7cb0c89c9f81bb5daba0e3b48" FOREIGN KEY ("giftId") REFERENCES "gift"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_8d86dfa6a33a2ccaafa0707b91f" FOREIGN KEY ("giftId") REFERENCES "gift"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "image" DROP CONSTRAINT "FK_8d86dfa6a33a2ccaafa0707b91f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_detail" DROP CONSTRAINT "FK_5e7cb0c89c9f81bb5daba0e3b48"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gift" DROP CONSTRAINT "FK_880c8d4ed7b282abbeb060b5b91"`,
    );
    await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "giftId"`);
    await queryRunner.query(
      `ALTER TABLE "product_detail" DROP COLUMN "giftId"`,
    );
    await queryRunner.query(`DROP TABLE "gift"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePricePriceHistory1740120440682
  implements MigrationInterface
{
  name = 'CreatePricePriceHistory1740120440682';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "prices" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "base_price" integer NOT NULL, "discount_price" integer NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "productId" integer, CONSTRAINT "PK_2e40b9e4e631a53cd514d82ccd2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "history_prices" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "old_price" integer, "new_price" integer, "changed_at" TIMESTAMP, "changed_by" character varying, "productId" integer, CONSTRAINT "PK_a37c2046124ed90e60eec2b9ed7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ADD CONSTRAINT "FK_fe932c923ecd4abc3f0ac915736" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "history_prices" ADD CONSTRAINT "FK_2adaad095e79fd5f0d0c08982bb" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "history_prices" DROP CONSTRAINT "FK_2adaad095e79fd5f0d0c08982bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" DROP CONSTRAINT "FK_fe932c923ecd4abc3f0ac915736"`,
    );
    await queryRunner.query(`DROP TABLE "history_prices"`);
    await queryRunner.query(`DROP TABLE "prices"`);
  }
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategory1741154138462 implements MigrationInterface {
  name = 'CreateCategory1741154138462';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categories" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "productId" integer, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_40b29caafc0bbdf6d98a3ad2e41" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "FK_40b29caafc0bbdf6d98a3ad2e41"`,
    );
    await queryRunner.query(`DROP TABLE "categories"`);
  }
}

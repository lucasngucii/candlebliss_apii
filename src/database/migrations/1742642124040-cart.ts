import { MigrationInterface, QueryRunner } from 'typeorm';

export class Cart1742642124040 implements MigrationInterface {
  name = 'Cart1742642124040';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cart-item" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "productDetailId" integer NOT NULL, "quantity" integer NOT NULL, "totalPrice" numeric NOT NULL, "cartId" integer, CONSTRAINT "PK_0bab23e63a695e02f3b9496809b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cart_status_enum" AS ENUM('active', 'completed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "userId" integer NOT NULL, "status" "public"."cart_status_enum" NOT NULL DEFAULT 'active', "totalPrice" numeric NOT NULL DEFAULT '0', "totalQuantity" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart-item" ADD CONSTRAINT "FK_7f05d97bef35db4f1f4b2f8c412" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart-item" DROP CONSTRAINT "FK_7f05d97bef35db4f1f4b2f8c412"`,
    );
    await queryRunner.query(`DROP TABLE "cart"`);
    await queryRunner.query(`DROP TYPE "public"."cart_status_enum"`);
    await queryRunner.query(`DROP TABLE "cart-item"`);
  }
}

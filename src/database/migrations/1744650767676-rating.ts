import { MigrationInterface, QueryRunner } from "typeorm";

export class Rating1744650767676 implements MigrationInterface {
    name = 'Rating1744650767676'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "ratting" integer`);
        await queryRunner.query(`ALTER TABLE "product_detail" ADD "rating" numeric(10,2) NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_detail" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "ratting"`);
    }

}

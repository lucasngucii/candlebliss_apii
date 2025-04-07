import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrder1744015836421 implements MigrationInterface {
    name = 'UpdateOrder1744015836421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "order_code" character varying DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "order_code"`);
    }

}

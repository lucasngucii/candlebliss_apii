import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrder1744014940055 implements MigrationInterface {
    name = 'UpdateOrder1744014940055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "voucher_id" character varying DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "order_item" ALTER COLUMN "totalPrice" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item" ALTER COLUMN "totalPrice" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "voucher_id"`);
    }

}

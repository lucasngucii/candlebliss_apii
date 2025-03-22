import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateImage1739724087461 implements MigrationInterface {
  name = 'UpdateImage1739724087461';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "caption"`);
    await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "image" DROP COLUMN "isPoster"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "image" ADD "isPoster" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" ADD "description" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" ADD "caption" character varying NOT NULL DEFAULT ''`,
    );
  }
}

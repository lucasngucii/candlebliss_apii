import { MigrationInterface, QueryRunner } from 'typeorm';

export class Create1742918333712 implements MigrationInterface {
  name = 'Create1742918333712';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "orders" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "user_id" integer NOT NULL, "status" "public"."orders_status_enum" NOT NULL, "address" character varying, "total_quantity" integer, "total_price" numeric, "discount" numeric, "ship_price" numeric, "method_payment" character varying, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "order_item" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "status" character varying NOT NULL, "productDetailId" integer, "quantity" integer NOT NULL, "totalPrice" numeric NOT NULL, "orderId" integer, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart_item" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "productDetailId" integer, "quantity" integer NOT NULL, "totalPrice" numeric NOT NULL, "cartId" integer, CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "userId" integer NOT NULL, "status" "public"."cart_status_enum" NOT NULL DEFAULT 'active', "totalPrice" numeric NOT NULL DEFAULT '0', "totalQuantity" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "status" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "email" character varying, "password" character varying, "provider" character varying NOT NULL DEFAULT 'email', "socialId" character varying, "firstName" character varying, "lastName" character varying, "phone" integer, "photoId" uuid, "roleId" integer, "statusId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_75e2be4ce11d447ef43be0e374" UNIQUE ("photoId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8e1f623798118e629b46a9e629" ON "user" ("phone") `,
    );
    await queryRunner.query(
      `CREATE TABLE "address" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "province" character varying NOT NULL, "district" character varying NOT NULL, "ward" character varying NOT NULL, "street" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "prices" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "base_price" numeric NOT NULL, "discount_price" numeric NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP NOT NULL, "productDetailId" integer, CONSTRAINT "REL_af01ab38a73069fbf8255fd6e7" UNIQUE ("productDetailId"), CONSTRAINT "PK_2e40b9e4e631a53cd514d82ccd2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gift" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "name" character varying NOT NULL DEFAULT '', "description" text NOT NULL DEFAULT '', "video" character varying NOT NULL DEFAULT '', "pricesId" integer, CONSTRAINT "REL_880c8d4ed7b282abbeb060b5b9" UNIQUE ("pricesId"), CONSTRAINT "PK_f91217caddc01a085837ebe0606" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_detail" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "size" character varying, "type" character varying, "isActive" boolean NOT NULL DEFAULT false, "quantities" integer NOT NULL DEFAULT '0', "productId" integer, CONSTRAINT "PK_12ea67a439667df5593ff68fc33" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "image" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL DEFAULT '', "public_id" character varying NOT NULL DEFAULT '', "productImagesId" integer, "productDetailsId" integer, "giftId" integer, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "productId" integer, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "video" character varying NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_22cc43e9a74d7498546e9a63e7" ON "product" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "vouchers" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "code" character varying NOT NULL, "description" character varying DEFAULT '', "amount_off" numeric(10,2) NOT NULL, "percent_off" numeric(10,2) NOT NULL, "min_order_value" numeric(10,2), "max_voucher_amount" numeric(10,2), "usage_limit" integer NOT NULL, "usage_per_customer" integer, "start_date" TIMESTAMP NOT NULL DEFAULT now(), "end_date" TIMESTAMP NOT NULL DEFAULT now(), "applicable_categories" text, "new_customers_only" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_efc30b2b9169e05e0e1e19d6dd6" UNIQUE ("code"), CONSTRAINT "PK_ed1b7dd909a696560763acdbc04" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_efc30b2b9169e05e0e1e19d6dd" ON "vouchers" ("code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "history_prices" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "old_price" integer, "new_price" integer, "changed_at" TIMESTAMP, "changed_by" character varying, "productId" integer, CONSTRAINT "PK_a37c2046124ed90e60eec2b9ed7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "isDeleted" boolean NOT NULL DEFAULT false, "id" SERIAL NOT NULL, "hash" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `,
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
      `CREATE TABLE "vouchers_applicable_products_product" ("vouchersId" integer NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_03499adbda4bb5c8e33b7a53df6" PRIMARY KEY ("vouchersId", "productId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c4c81308b7bb784bab9b847503" ON "vouchers_applicable_products_product" ("vouchersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_96fad0f1d65e84241b3dd61e59" ON "vouchers_applicable_products_product" ("productId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" ADD CONSTRAINT "FK_af01ab38a73069fbf8255fd6e72" FOREIGN KEY ("productDetailId") REFERENCES "product_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gift" ADD CONSTRAINT "FK_880c8d4ed7b282abbeb060b5b91" FOREIGN KEY ("pricesId") REFERENCES "prices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_detail" ADD CONSTRAINT "FK_2c1471f10d59111c8d052b0bdbc" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_9de502f277b49eeef56ff6cf7ac" FOREIGN KEY ("productImagesId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_86140dee32ed75ce2a6c1694f69" FOREIGN KEY ("productDetailsId") REFERENCES "product_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_8d86dfa6a33a2ccaafa0707b91f" FOREIGN KEY ("giftId") REFERENCES "gift"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_40b29caafc0bbdf6d98a3ad2e41" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "history_prices" ADD CONSTRAINT "FK_2adaad095e79fd5f0d0c08982bb" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "gift_product_details_product_detail" ADD CONSTRAINT "FK_861d517ab2de2c573412bce5f5f" FOREIGN KEY ("giftId") REFERENCES "gift"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "gift_product_details_product_detail" ADD CONSTRAINT "FK_6f8637b98836528108103c89cb7" FOREIGN KEY ("productDetailId") REFERENCES "product_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers_applicable_products_product" ADD CONSTRAINT "FK_c4c81308b7bb784bab9b847503d" FOREIGN KEY ("vouchersId") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers_applicable_products_product" ADD CONSTRAINT "FK_96fad0f1d65e84241b3dd61e594" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vouchers_applicable_products_product" DROP CONSTRAINT "FK_96fad0f1d65e84241b3dd61e594"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vouchers_applicable_products_product" DROP CONSTRAINT "FK_c4c81308b7bb784bab9b847503d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gift_product_details_product_detail" DROP CONSTRAINT "FK_6f8637b98836528108103c89cb7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gift_product_details_product_detail" DROP CONSTRAINT "FK_861d517ab2de2c573412bce5f5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "history_prices" DROP CONSTRAINT "FK_2adaad095e79fd5f0d0c08982bb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "FK_40b29caafc0bbdf6d98a3ad2e41"`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" DROP CONSTRAINT "FK_8d86dfa6a33a2ccaafa0707b91f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" DROP CONSTRAINT "FK_86140dee32ed75ce2a6c1694f69"`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" DROP CONSTRAINT "FK_9de502f277b49eeef56ff6cf7ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_detail" DROP CONSTRAINT "FK_2c1471f10d59111c8d052b0bdbc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "gift" DROP CONSTRAINT "FK_880c8d4ed7b282abbeb060b5b91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "prices" DROP CONSTRAINT "FK_af01ab38a73069fbf8255fd6e72"`,
    );
    await queryRunner.query(
      `ALTER TABLE "address" DROP CONSTRAINT "FK_d25f1ea79e282cc8a42bd616aa3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "FK_29e590514f9941296f3a2440d39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_96fad0f1d65e84241b3dd61e59"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c4c81308b7bb784bab9b847503"`,
    );
    await queryRunner.query(
      `DROP TABLE "vouchers_applicable_products_product"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6f8637b98836528108103c89cb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_861d517ab2de2c573412bce5f5"`,
    );
    await queryRunner.query(`DROP TABLE "gift_product_details_product_detail"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "history_prices"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_efc30b2b9169e05e0e1e19d6dd"`,
    );
    await queryRunner.query(`DROP TABLE "vouchers"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_22cc43e9a74d7498546e9a63e7"`,
    );
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "image"`);
    await queryRunner.query(`DROP TABLE "product_detail"`);
    await queryRunner.query(`DROP TABLE "gift"`);
    await queryRunner.query(`DROP TABLE "prices"`);
    await queryRunner.query(`DROP TABLE "address"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8e1f623798118e629b46a9e629"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "status"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "cart"`);
    await queryRunner.query(`DROP TABLE "cart_item"`);
    await queryRunner.query(`DROP TABLE "order_item"`);
    await queryRunner.query(`DROP TABLE "orders"`);
  }
}

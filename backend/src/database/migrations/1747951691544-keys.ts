import { MigrationInterface, QueryRunner } from "typeorm";

export class Keys1747951691544 implements MigrationInterface {
    name = 'Keys1747951691544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "studio" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text, "price_per_hour" numeric(10,2) NOT NULL DEFAULT '0', "lock_device_id" character varying NOT NULL, "is_locked" boolean NOT NULL DEFAULT false, "lock_api_Key" character varying NOT NULL, CONSTRAINT "PK_4c17ecb2b175322407ebbaef5c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "equipment" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text, "price_per_hour" numeric(10,2) NOT NULL, CONSTRAINT "PK_0722e1b9d6eb19f5874c1678740" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session_equipment" ("id" SERIAL NOT NULL, "hours" numeric(4,2) NOT NULL, "sessionId" integer, "equipmentId" integer, CONSTRAINT "PK_8d86b88bdb7835b60a44dcb8ec7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "session" ("id" SERIAL NOT NULL, "client_name" text NOT NULL, "client_phone" text NOT NULL, "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "total_price" numeric(10,2) NOT NULL, "access_code" character varying(6) NOT NULL, "access_granted" boolean NOT NULL DEFAULT false, "actual_entry_time" TIMESTAMP, "actual_exit_time" TIMESTAMP, "studioId" integer, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "session_equipment" ADD CONSTRAINT "FK_46d63636219e91dc0a85e394ce0" FOREIGN KEY ("sessionId") REFERENCES "session"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session_equipment" ADD CONSTRAINT "FK_b81a105947f8f1edc20d8d80c7c" FOREIGN KEY ("equipmentId") REFERENCES "equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_14a0837f75b88e2baf93e6a5563" FOREIGN KEY ("studioId") REFERENCES "studio"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_14a0837f75b88e2baf93e6a5563"`);
        await queryRunner.query(`ALTER TABLE "session_equipment" DROP CONSTRAINT "FK_b81a105947f8f1edc20d8d80c7c"`);
        await queryRunner.query(`ALTER TABLE "session_equipment" DROP CONSTRAINT "FK_46d63636219e91dc0a85e394ce0"`);
        await queryRunner.query(`DROP TABLE "session"`);
        await queryRunner.query(`DROP TABLE "session_equipment"`);
        await queryRunner.query(`DROP TABLE "equipment"`);
        await queryRunner.query(`DROP TABLE "studio"`);
    }

}

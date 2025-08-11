import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedInitialData1754945882000 implements MigrationInterface {
  name = "SeedInitialData1754945882000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO "studio" ("name", "description", "price_per_hour", "lock_device_id", "is_locked", "lock_api_Key")
            VALUES 
                ('Большой зал', 'Большой зал', 700, '1', false, '1'),
                ('Средний зал', 'Средний зал', 600, '2', false, '2'),
                ('Малый зал', 'Малый зал', 500, '3', false, '3')
        `);

    await queryRunner.query(`
            INSERT INTO "equipment" ("name", "description", "price_per_hour")
            VALUES 
                ('Тарелки', 'Тарелки', 100),
                ('Комбик 1', 'Комбик 1', 150)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "studio" WHERE "name" IN ('Большой зал', 'Средний зал', 'Малый зал')`
    );
    await queryRunner.query(
      `DELETE FROM "equipment" WHERE "name" IN ('Тарелки', 'Комбик 1')`
    );
  }
}

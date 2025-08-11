import { MigrationInterface, QueryRunner } from 'typeorm';

export class Keys1747951691545 implements MigrationInterface {
    name = 'Keys1747951691545';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO studio (
    id, 
    name, 
    description, 
    price_per_hour, 
    lock_device_id, 
    is_locked, 
    lock_api_key
) 
VALUES (
    1, 
    'Большой зал', 
    'Большой зал', 
    700.00, 
    '1', 
    true, 
    'api1'
);`);
        await queryRunner.query(`INSERT INTO studio (
    id, 
    name, 
    description, 
    price_per_hour, 
    lock_device_id, 
    is_locked, 
    lock_api_key
) 
VALUES (
    2, 
    'Средний зал', 
    'Средний зал', 
    600.00, 
    '2', 
    true, 
    'api2'
);`);
        await queryRunner.query(`INSERT INTO studio (
    id, 
    name, 
    description, 
    price_per_hour, 
    lock_device_id, 
    is_locked, 
    lock_api_key
) 
VALUES (
    3, 
    'Малый зал', 
    'Малый зал', 
    500.00, 
    '3', 
    true, 
    'api3'
);`);
 await queryRunner.query(`INSERT INTO equipment (
    id, 
    name, 
    description, 
    price_per_hour, 
) 
VALUES (
    1, 
    'Доп. тарелки', 
    'Доп. тарелки', 
    100.00, 
);`);
await queryRunner.query(`INSERT INTO equipment (
    id, 
    name, 
    description, 
    price_per_hour, 
) 
VALUES (
    2, 
    'Доп. комбик', 
    'Доп. комбик', 
    200.00, 
);`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "studio"`);
    }
}

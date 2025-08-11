import * as dotenv from 'dotenv';
import * as path from 'path';
import { DataSource } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { SessionEquipment } from './entities/session-equipment.entity';
import { Session } from './entities/sessions.entity';
import { Studio } from './entities/studios.entity';

dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const entitiesPath = path.join(process.cwd(), 'dist/**/*.entity{.ts,.js}');
const migrationsPath = path.join(process.cwd(), 'dist/database/migrations/*{.ts,.js}');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Session, Studio, Equipment, SessionEquipment],
  migrations: [migrationsPath],
  synchronize: false,
  migrationsRun: true,
  logging: true,
});

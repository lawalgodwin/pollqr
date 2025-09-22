import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*.js'],
  synchronize: false,
  logger: 'advanced-console',
  logging: ['error', 'warn'],
};

export default new DataSource(dataSourceOptions);

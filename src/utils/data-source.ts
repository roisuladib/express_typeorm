import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { getConfig } from './config';

const postgresConfig = getConfig<{
   host: string;
   port: number;
   username: string;
   password: string;
   database: string;
}>('postgresConfig');

export const AppDataSource = new DataSource({
   ...postgresConfig,
   type: 'postgres',
   synchronize: false,
   logging: false,
   entities: ['src/entities/**/*.entity{.ts,.js}'],
   migrations: ['src/migrations/**/*{.ts,.js}'],
   subscribers: ['src/subscribers/**/*{.ts,.js}'],
});

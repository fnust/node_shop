import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import Entities from './model/entities/';

config();

export default new DataSource({
  type: 'postgres',
  username: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
  synchronize: true,
  cache: false,
  entities: [...Entities],
});

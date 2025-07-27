import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  name: process.env.DB_NAME || 'nestjs',
  synchronize: process.env.DB_SYNC === 'true' ? true : false,
  autoLoadEntities: process.env.AUTO_LOAD_ENTITIES === 'true' ? true : false,
}));

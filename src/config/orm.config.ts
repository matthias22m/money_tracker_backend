import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const ormConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: Number(configService.get<string>('DB_PORT')) || 5432,
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASS'),
  database: configService.get<string>('DB_NAME'),
  ssl: {
    rejectUnauthorized: false, // Required by Neon
  },
  extra: {
    sslmode: 'require', // Enforces SSL connection
  },
  autoLoadEntities: true,
  synchronize: true, // ❗ Disable in production
});

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const TypeOrmImport = TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABESE'),
    // TODO: Migrations
    synchronize: true,
    autoLoadEntities: true,
    keepConnectionAlive: true,
  }),
  inject: [ConfigService],
});

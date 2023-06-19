import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CatalogModule } from './modules/catalog/catalog.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './modules/catalog/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/catalog-request/.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        // entities: [__dirname + '/**/*.entity{.ts,.js}'],
        entities: [Product],
        synchronize: true,
        autoLoadEntities: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    CatalogModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import redisStore from 'cache-manager-redis-store';
import { ProductModule } from './modules/product/product.module';
import { Product } from './modules/product/entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/catalog/.env',
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore as unknown as CacheStore,
      socket: {
        host: 'localhost',
        port: 6379,
      },
    }),

    // CacheModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     isGlobal: true,
    //     store: redisStore,
    //     socket: {
    //       // host: configService.get<string>('REDIS_HOST'),
    //       // port: configService.get<number>('REDIS_PORT')
    //
    //     }
    //   }),
    //   inject: [ConfigService],
    // }),
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
    ProductModule,
  ],
})
export class AppModule {}

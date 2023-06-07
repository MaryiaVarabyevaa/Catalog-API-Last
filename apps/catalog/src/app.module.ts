import { Module } from '@nestjs/common';
import {CatalogModule} from "./modules/catalog/catalog.module";
import {ConfigModule} from "@nestjs/config";


@Module({
  imports: [
      ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: './apps/catalog/.env',
      }),
      CatalogModule
  ],
})
export class AppModule {}

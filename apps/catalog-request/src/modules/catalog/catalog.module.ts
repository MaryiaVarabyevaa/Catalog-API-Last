import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities';
import { CatalogController } from './catalog.controller';
import { RmqModule } from '@app/common';
import { CATALOG_SERVICE } from './constants';
import {TransactionHelper} from "./helpers";

@Module({
  imports: [
    RmqModule.register({
      name: CATALOG_SERVICE,
    }),
    TypeOrmModule.forFeature([Product]),
  ],
  providers: [CatalogService, TransactionHelper],
  controllers: [CatalogController],
})
export class CatalogModule {}

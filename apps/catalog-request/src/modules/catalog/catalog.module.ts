import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RmqModule } from '@app/common';
import { CatalogService } from './catalog.service';
import { Product } from './entities';
import { CatalogController } from './catalog.controller';
import { CATALOG_SERVICE } from './constants';
import { SendMessageHelper } from './helpers';

@Module({
  imports: [
    RmqModule.register({
      name: CATALOG_SERVICE,
    }),
    TypeOrmModule.forFeature([Product]),
  ],
  providers: [CatalogService, SendMessageHelper],
  controllers: [CatalogController],
})
export class CatalogModule {}

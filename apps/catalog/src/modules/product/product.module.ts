import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RmqModule } from '@app/common';
import { Product } from './entities';
import { ProductQueryService } from './product-query.service';
import { ProductRequestService } from './product-request.service';
import { ProductController } from './product.controller';

@Module({
  imports: [RmqModule, TypeOrmModule.forFeature([Product])],
  providers: [ProductQueryService, ProductRequestService],
  controllers: [ProductController],
})
export class ProductModule {}

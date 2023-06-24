import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { Pattern } from './constants';
import { CatalogService } from './catalog.service';
import { GetData } from './decorator';
import {
  CreateProductData,
  DeleteProductData, ProductInfo,
  UpdateProductData,
  UpdateQuantityData,
} from './types';
import { Product } from './entities';

@Controller()
export class CatalogController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly catalogService: CatalogService,
  ) {}

  @MessagePattern({ cmd: Pattern.CREATE_PRODUCT })
  async handleCreateProduct(
    @GetData() createProductData: CreateProductData,
    @Ctx() context: RmqContext,
  ): Promise<Product> {
    const res = await this.catalogService.createProduct(createProductData);
    this.rmqService.ack(context);
    return res;
  }

  @MessagePattern({ cmd: Pattern.UPDATE_PRODUCT })
  async handleUpdateProduct(
    @GetData() updateProductData: UpdateProductData,
    @Ctx() context: RmqContext,
  ): Promise<Product> {
    const res = await this.catalogService.updateProduct(updateProductData);
    this.rmqService.ack(context);
    return res;
  }

  @MessagePattern({ cmd: Pattern.DELETE_PRODUCT })
  async handleDeleteProduct(
    @GetData() deleteProductData: DeleteProductData,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.catalogService.deleteProduct(deleteProductData);
    this.rmqService.ack(context);
  }

  @MessagePattern({ cmd: Pattern.CHECK_PRODUCT_QUANTITY })
  async handleUpdateQuantity(
    @GetData() updateQuantityData: UpdateQuantityData[],
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.catalogService.updateQuantity(updateQuantityData);
    this.rmqService.ack(context);
  }

  @MessagePattern({ cmd: Pattern.COMMIT_PRODUCT_QUANTITY })
  async handleCommitUpdateQuantity(
    @GetData() productInfo: ProductInfo[],
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.catalogService.commitProductQuantity(productInfo);
    this.rmqService.ack(context);
  }

  @MessagePattern({ cmd: Pattern.ROLLBACK_PRODUCT_QUANTITY })
  async handleRollbackUpdateQuantity(
    @GetData() productInfo: ProductInfo[],
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.catalogService.rollbackProductQuantity(productInfo);
    this.rmqService.ack(context);
  }
}

import { Controller, UseInterceptors } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { Pattern } from './constants';
import {
  CreateProductData,
  DeleteProductData, FindProductByIdData,
  QuantityData,
  UpdateProductData,
  UpdateQuantityData,
} from './types';
import { GetData } from './decorators';
import { ProductQueryService } from './product-query.service';
import { ProductRequestService } from './product-request.service';
import { Product } from './entities';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller()
export class ProductController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly productQueryService: ProductQueryService,
    private readonly productRequestService: ProductRequestService,
  ) {}

  @MessagePattern({ cmd: Pattern.FIND_PRODUCT_BY_ID })
  async handleFindProductById(
    @GetData() findProductByIdData: FindProductByIdData,
    @Ctx() context: RmqContext,
  ): Promise<Product> {
    const res = await this.productQueryService.findProductById(
      findProductByIdData,
    );
    this.rmqService.ack(context);
    return res;
  }

  @MessagePattern({ cmd: Pattern.FIND_ALL_PRODUCTS })
  async handleFindAllProducts(@Ctx() context: RmqContext): Promise<Product[]> {
    const res = await this.productQueryService.findAllProducts();
    this.rmqService.ack(context);
    return res;
  }

  @MessagePattern({ cmd: Pattern.PRODUCT_CREATED })
  async handleCreateProduct(
    @GetData() createProductData: CreateProductData,
    @Ctx() context: RmqContext,
  ): Promise<Product> {
    const res = await this.productRequestService.createProduct(createProductData);
    this.rmqService.ack(context);
    return res;
  }

  @MessagePattern({ cmd: Pattern.PRODUCT_UPDATED })
  async handleUpdateProduct(
    @GetData() updateProductData: UpdateProductData,
    @Ctx() context: RmqContext,
  ): Promise<Product> {
    const res = await this.productRequestService.updatedProduct(updateProductData);
    this.rmqService.ack(context);
    return res;
  }

  @MessagePattern({ cmd: Pattern.PRODUCT_DELETED })
  async handleDeleteProduct(
    @GetData() deleteProductData: DeleteProductData,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.productRequestService.deletedProduct(deleteProductData);
    this.rmqService.ack(context);
  }

  @MessagePattern({ cmd: Pattern.CHECK_PRODUCT_QUANTITY })
  async handleUpdateQuantity(
    @GetData() updateQuantityData: UpdateQuantityData,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.productRequestService.updateQuantityProduct(updateQuantityData);
    this.rmqService.ack(context);
  }

  @MessagePattern({ cmd: Pattern.COMMIT_PRODUCT })
  async handleCommitUpdateProduct(
    @GetData() { id }: DeleteProductData,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.productRequestService.commitProduct(id);
    this.rmqService.ack(context);
  }

  @MessagePattern({ cmd: Pattern.COMMIT_UPDATED_QUANTITY })
  async handleCommitUpdatedQuantity(
    @GetData() quantityData: QuantityData[],
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.productRequestService.commitUpdatedQuantity(quantityData);
    this.rmqService.ack(context);
  }

  @MessagePattern({ cmd: Pattern.ROLLBACK_DELETE_NEW_PRODUCT })
  async handleRollbackDeleteNewProduct(
    @GetData() deleteProductData: DeleteProductData,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.productRequestService.rollbackDeleteNewProduct(
      deleteProductData,
    );
    this.rmqService.ack(context);
  }

  @MessagePattern({ cmd: Pattern.ROLLBACK_PRODUCT })
  async handleRollbackUpdateProduct(
    @GetData() { id }: DeleteProductData,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.productRequestService.rollbackProduct(id);
    this.rmqService.ack(context);
  }

  @MessagePattern({ cmd: Pattern.ROLLBACK_DELETE_PRODUCT })
  async handleRollbackDeleteProduct(
    @GetData() { id }: DeleteProductData,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.productRequestService.rollbackDeleteProduct(id);
    this.rmqService.ack(context);
  }

  @MessagePattern({ cmd: Pattern.ROLLBACK_UPDATED_QUANTITY })
  async handleRollbackUpdatedQuantity(
    @GetData() quantityData: QuantityData[],
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.productRequestService.rollbackUpdatedQuantity(quantityData);
    this.rmqService.ack(context);
  }
}

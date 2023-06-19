import { Controller } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  RmqContext,
} from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { Pattern } from './constants';
import {
  CreateProductData,
  DeleteProductData,
  FindProductByIdData,
  UpdateProductData,
  UpdateQuantityData,
} from './types';
import { GetData } from './decorators';
import { ProductQueryService } from './product-query.service';
import { ProductRequestService } from './product-request.service';
import { Product } from './entities';

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
  async handleFindAllProducts(
    // @GetData() createUserData: CreateUserData,
    @Ctx() context: RmqContext,
  ) {
    const res = await this.productQueryService.findAllProducts();
    this.rmqService.ack(context);
    return res;
  }

  @MessagePattern({ cmd: Pattern.PRODUCT_CREATED })
  async handleCreateProduct(
    @GetData() createProductData: CreateProductData,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.productRequestService.createProduct(createProductData);
    this.rmqService.ack(context);
  }

  @EventPattern(Pattern.PRODUCT_UPDATED)
  async handleUpdateProduct(
    @GetData() updateProductData: UpdateProductData,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.productRequestService.updatedProduct(updateProductData);
    this.rmqService.ack(context);
  }

  @EventPattern(Pattern.PRODUCT_DELETED)
  async handleDeleteProduct(
    @GetData() deleteProductData: DeleteProductData,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.productRequestService.deletedProduct(deleteProductData);
    this.rmqService.ack(context);
  }

  @EventPattern(Pattern.PRODUCT_QUANTITY_CHANGED)
  async handleUpdateQuantity(
    @GetData() updateQuantityData: UpdateQuantityData,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.productRequestService.updateQuantityProduct(updateQuantityData);
    this.rmqService.ack(context);
  }
}

import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';
import { CartService } from './cart.service';
import { Pattern } from './constants';
import { GetData } from './decorator';
import {
  ClearCartData,
  CreateProductData,
  GetCurrentCartData,
  GetCurrentCartToOrderData,
  UpdateProductData,
} from './types';
import { Cart } from './entities';

@Controller()
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: Pattern.ADD_PRODUCT_TO_CART })
  async handleAddProductToCart(
    @GetData() createProductData: CreateProductData,
    @Ctx() context: RmqContext,
  ): Promise<Cart> {
    const res = await this.cartService.addProductToCart(createProductData);
    this.rmqService.ack(context);
    return res;
  }

  @MessagePattern({ cmd: Pattern.UPDATE_CART })
  async handleUpdateProduct(
    @GetData() updateProductData: UpdateProductData,
    @Ctx() context: RmqContext,
  ): Promise<Cart> {
    const res = await this.cartService.updateCart(updateProductData);
    this.rmqService.ack(context);
    return res;
  }

  @MessagePattern({ cmd: Pattern.CLEAR_CART })
  async handleClearCart(
    @GetData() clearCartData: ClearCartData,
    @Ctx() context: RmqContext,
  ): Promise<boolean> {
    await this.cartService.clearCart(clearCartData);
    this.rmqService.ack(context);
    return true;
  }

  @MessagePattern({ cmd: Pattern.GET_CURRENT_CART })
  async handleGetCurrentCart(
    @GetData() getCurrentCartData: GetCurrentCartData,
    @Ctx() context: RmqContext,
  ): Promise<Cart> {
    const res = await this.cartService.getCurrentCart(getCurrentCartData);
    this.rmqService.ack(context);
    return res;
  }

  @MessagePattern({ cmd: Pattern.GET_CURRENT_CART_TO_ORDER })
  async handleGetCurrentCartToOrder(
    @GetData() getCurrentCartData: GetCurrentCartToOrderData,
    @Ctx() context: RmqContext,
  ): Promise<Cart> {
    const res = await this.cartService.getCurrentCartToOrder(
      getCurrentCartData,
    );
    this.rmqService.ack(context);
    return res;
  }

  @MessagePattern({ cmd: Pattern.COMMIT_GET_CART })
  async handleCommitGetCart(
    @GetData() getCurrentCartData: GetCurrentCartToOrderData,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.cartService.commitGetCart(getCurrentCartData);
    this.rmqService.ack(context);
  }

  @MessagePattern({ cmd: Pattern.ROLLBACK_GET_CART })
  async handleRollbackGetCart(
    @GetData() getCurrentCartData: GetCurrentCartToOrderData,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.cartService.rollbackGetCart(getCurrentCartData);
    this.rmqService.ack(context);
  }
}

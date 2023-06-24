import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AtGuard } from '../auth/guards';
import { CartService } from './cart.service';
import {
  AddProductInput,
  ClearCartInput,
  UpdateProductInCartInput,
} from './dtos';
import { GetCurrentUserId } from '../../common/decorators';
import { CartEntity } from './entities';

@Resolver('Cart')
@UseGuards(AtGuard)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => CartEntity)
  async getCurrentCart(@GetCurrentUserId() userId: number) {
    const res = await this.cartService.getCurrentCart(userId);
    return res;
  }

  @Mutation(() => CartEntity)
  async addProductToCart(
    @Args('addProduct') addProductInput: AddProductInput,
    @GetCurrentUserId() userId: number,
  ): Promise<CartEntity> {
    const res = await this.cartService.addProductToCart(
      addProductInput,
      userId,
    );
    return res;
  }

  @Mutation(() => CartEntity)
  async updateProductInCart(
    @Args('updateProduct') updateProductInput: UpdateProductInCartInput,
    @GetCurrentUserId() userId: number,
  ): Promise<CartEntity> {
    const res = await this.cartService.updateProductInCart(
      updateProductInput,
      userId,
    );
    return res;
  }

  @Mutation(() => Boolean)
  async clearCart(
    @Args('clearCart') clearCartInput: ClearCartInput,
  ): Promise<boolean> {
    await this.cartService.clearCart(clearCartInput);
    return true;
  }
}

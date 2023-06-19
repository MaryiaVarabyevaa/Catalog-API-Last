import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AddProductInput, UpdateProductInput } from './dtos';
import { CART_SERVICE, Pattern } from './constants';
import { Data } from './types';

@Injectable()
export class CartService {
  constructor(@Inject(CART_SERVICE) private cartClient: ClientProxy) {}

  async addProductToCart(addProductInput: AddProductInput, userId: number) {
    const res = await this.sendMessage(Pattern.ADD_PRODUCT_TO_CART, {
      ...addProductInput,
      userId,
    });
    return res;
  }

  async updateProductInCart(
    updateProductInput: UpdateProductInput,
    userId: number,
  ) {
    const res = await this.sendMessage(Pattern.UPDATE_CART, {
      ...updateProductInput,
      userId,
    });
    return res;
  }

  async clearCart(userId: number) {
    const res = await this.sendMessage(Pattern.CLEAR_CART, { userId });
    return res;
  }

  async getCurrentCart(userId: number) {
    const res = await this.sendMessage(Pattern.GET_CURRENT_CART, { userId });
    return res;
  }

  private async sendMessage(msg: Pattern, data: Data) {
    const pattern = { cmd: msg };
    return await this.cartClient.send(pattern, { data }).toPromise();
  }
}

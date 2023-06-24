import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AddProductInput,
  ClearCartInput,
  UpdateProductInCartInput,
} from './dtos';
import { CART_SERVICE, Pattern } from './constants';
import { Data } from './types';
import { CartEntity } from './entities';

@Injectable()
export class CartService {
  constructor(@Inject(CART_SERVICE) private cartClient: ClientProxy) {}

  async addProductToCart(
    addProductInput: AddProductInput,
    userId: number,
  ): Promise<CartEntity> {
    const res = await this.sendMessage<CartEntity>(Pattern.ADD_PRODUCT_TO_CART, {
      ...addProductInput,
      userId,
    });
    return res;
  }

  async updateProductInCart(
    updateProductInput: UpdateProductInCartInput,
    userId: number,
  ): Promise<CartEntity> {
    const res = await this.sendMessage<CartEntity>(Pattern.UPDATE_CART, {
      ...updateProductInput,
      userId,
    });
    return res;
  }

  async clearCart(clearCartInput: ClearCartInput): Promise<boolean> {
    const res = await this.sendMessage<boolean>(Pattern.CLEAR_CART, clearCartInput);
    return res;
  }

  async getCurrentCart(userId: number): Promise<CartEntity> {
    const res = await this.sendMessage<CartEntity>(Pattern.GET_CURRENT_CART, { userId });
    return res;
  }

  private async sendMessage<T>(msg: Pattern, data: Data): Promise<T> {
    const pattern = { cmd: msg };
    return await this.cartClient.send(pattern, { data }).toPromise();
  }
}

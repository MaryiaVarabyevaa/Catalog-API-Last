import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ORDER_SERVICE, Pattern } from './constants';
import {
  CreateOrderInput,
  GetOrderIdInput,
  PayOrderInput,
  UpdateOrderInput,
} from './dtos';
import { Data } from './types';

@Injectable()
export class OrderService {
  constructor(@Inject(ORDER_SERVICE) private authClient: ClientProxy) {}

  async createOrder(createOrderInput: CreateOrderInput, userId: number) {
    const res = await this.sendMessage(Pattern.CREATE_ORDER, {
      ...createOrderInput,
      userId,
    });
    return res;
  }

  async updateOrder(updateOrderInput: UpdateOrderInput, userId: number) {
    const res = await this.sendMessage(Pattern.UPDATE_ORDER, {
      ...updateOrderInput,
      userId,
    });
    return res;
  }

  async deleteOrder(getOrderIdInput: GetOrderIdInput) {
    const res = await this.sendMessage(Pattern.DELETE_ORDER, getOrderIdInput);
    return res;
  }

  async payOrder(payOrderInput: PayOrderInput) {
    const res = await this.sendMessage(Pattern.PAY_ORDER, payOrderInput);
    return res;
  }

  async getAllUserOrder(userId: number) {
    const res = await this.sendMessage(Pattern.GET_ALL_USER_ORDERS, { userId });
    return res;
  }

  async getLatestUserOrder(userId: number) {
    const res = await this.sendMessage(Pattern.GET_LATEST_USER_ORDER, {
      userId,
    });
    return res;
  }

  private async sendMessage(msg: Pattern, data: Data) {
    const pattern = { cmd: msg };
    return await this.authClient.send(pattern, { data }).toPromise();
  }
}

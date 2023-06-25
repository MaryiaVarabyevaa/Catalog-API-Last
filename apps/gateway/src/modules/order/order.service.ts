import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ORDER_SERVICE, Pattern } from './constants';
import { CreateOrderInput, DeleteOrderInput, PayOrderInput } from './dtos';
import { Data } from './types';
import { Order } from './entities';

@Injectable()
export class OrderService {
  constructor(@Inject(ORDER_SERVICE) private orderClient: ClientProxy) {}

  async createOrder(
    createOrderInput: CreateOrderInput,
    userId: number,
  ): Promise<Order> {
    const res = await this.sendMessage(Pattern.CREATE_ORDER, {
      ...createOrderInput,
      userId,
    });
    return res;
  }

  async deleteOrder(deleteOrderInput: DeleteOrderInput): Promise<void> {
    await this.sendMessage(Pattern.DELETE_ORDER, deleteOrderInput);
  }

  async payOrder(payOrderInput: PayOrderInput): Promise<Order> {
    const res = await this.sendMessage(Pattern.PAY_ORDER, payOrderInput);
    return res;
  }

  async getAllUserOrder(userId: number): Promise<Order[]> {
    const res = await this.sendMessage(Pattern.GET_ALL_USER_ORDERS, { userId });
    return res;
  }

  async getLatestUserOrder(userId: number): Promise<Order> {
    const res = await this.sendMessage(Pattern.GET_LATEST_USER_ORDER, {
      userId,
    });
    return res;
  }

  private async sendMessage(msg: Pattern, data: Data) {
    const pattern = { cmd: msg };
    return await this.orderClient.send(pattern, { data }).toPromise();
  }
}

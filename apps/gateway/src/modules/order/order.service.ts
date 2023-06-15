import {Inject, Injectable, LoggerService} from '@nestjs/common';
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';
import {AmqpConnection} from '@golevelup/nestjs-rabbitmq';
import {exchange, RoutingKey} from './constants';
import {CreateOrderInput, GetOrderIdInput, PayOrderInput, UpdateOrderInput,} from './dtos';

@Injectable()
export class OrderService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  async createOrder(createOrderInput: CreateOrderInput, userId: number) {
    const res = await this.sendMessageWithResponse(RoutingKey.CREATE_ORDER, {
      ...createOrderInput,
      userId,
    });
    return res;
  }

  async updateOrder(updateOrderInput: UpdateOrderInput, userId: number) {
    const res = await this.sendMessageWithResponse(RoutingKey.UPDATE_ORDER, {
      ...updateOrderInput,
      userId,
    });
    return res;
  }

  async deleteOrder(getOrderIdInput: GetOrderIdInput) {
    const res = await this.sendMessageWithResponse(
      RoutingKey.DELETE_ORDER,
      getOrderIdInput,
    );
    return res;
  }

  async payOrder(payOrderInput: PayOrderInput) {
    const res = await this.sendMessageWithResponse(
      RoutingKey.PAY_ORDER,
      payOrderInput,
    );
    return res;
  }

  async getAllUserOrder(userId: number) {
    const res = await this.sendMessageWithResponse(
        RoutingKey.GET_ALL_ORDER_BY_USER_ID,
        { userId }
    )
    return res;
  }

  async getLatestUserOrder(userId: number) {
    await this.sendMessageWithResponse(RoutingKey.GET_ORDER_BY_USER_ID, { userId });
    return 'getOrderByUserId';
  }

  private async sendMessageWithResponse(routingKey: RoutingKey, data: any) {
    return await this.amqpConnection.request({
      exchange,
      routingKey,
      payload: { ...data },
    });
  }
}

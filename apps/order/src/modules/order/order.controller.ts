import {Controller} from '@nestjs/common';
import {RmqService} from '@app/common';
import {Ctx, MessagePattern, RmqContext} from '@nestjs/microservices';
import {Pattern} from './constants';
import {OrderService} from './order.service';
import {GetData} from './decorators';
import {CreateOrderData, DeleteOrderData, Order, PayOrderData} from './types';

@Controller()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: Pattern.CREATE_ORDER })
  async handleCreateOrder(
    @GetData() createOrderData: CreateOrderData,
    @Ctx() context: RmqContext,
  ): Promise<Order> {
    const res = await this.orderService.createNewOrder(createOrderData);
    this.rmqService.ack(context);
    return res;
  }

  @MessagePattern({ cmd: Pattern.PAY_ORDER })
  async handlePayOrder(
    @GetData() payOrderData: PayOrderData,
    @Ctx() context: RmqContext,
  ): Promise<Order> {
    const res = await this.orderService.payOrder(payOrderData);
    this.rmqService.ack(context);
    return res;
  }

  @MessagePattern({ cmd: Pattern.DELETE_ORDER })
  async handleDeleteOrder(
    @GetData() deleteOrderData: DeleteOrderData,
    @Ctx() context: RmqContext,
  ): Promise<boolean> {
    await this.orderService.deleteOrder(deleteOrderData);
    this.rmqService.ack(context);
    return true;
  }
}

import { Controller } from '@nestjs/common';
import { RmqService } from '@app/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { Pattern } from './constants';
import { OrderService } from './order.service';
import { GetData } from './decorators';
import { CreateOrderData } from './types';

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
  ): Promise<any> {
    const res = await this.orderService.createNewOrder(createOrderData);
    this.rmqService.ack(context);
    // return res;
    return true;
  }
}

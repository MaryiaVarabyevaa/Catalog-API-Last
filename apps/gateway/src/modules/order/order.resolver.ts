import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities';
import { CreateOrderInput, DeleteOrderInput, PayOrderInput } from './dtos';
import { AtGuard } from '../auth/guards';
import { GetCurrentUserId } from '../../common/decorators';

@Resolver('Order')
@UseGuards(AtGuard)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [Order])
  async getAllUserOrders(@GetCurrentUserId() userId: number): Promise<Order[]> {
    const res = await this.orderService.getAllUserOrder(userId);
    return res;
  }

  @Query(() => Order)
  async getLatestUserOrder(@GetCurrentUserId() userId: number): Promise<Order> {
    const res = await this.orderService.getLatestUserOrder(userId);
    return res;
  }

  @Mutation(() => Order)
  async createOrder(
    @Args('createOrder') createOrderInput: CreateOrderInput,
    @GetCurrentUserId() userId: number,
  ): Promise<Order> {
    const res = await this.orderService.createOrder(createOrderInput, userId);
    return res;
  }

  @Mutation(() => Boolean)
  async deleteOrder(
    @Args('deleteOrder') deleteOrderInput: DeleteOrderInput,
  ): Promise<boolean> {
    await this.orderService.deleteOrder(deleteOrderInput);
    return true;
  }

  @Mutation(() => Order)
  async payOrder(
    @Args('payOrder') payOrderInput: PayOrderInput,
  ): Promise<Order> {
    const res = await this.orderService.payOrder(payOrderInput);
    return res;
  }
}

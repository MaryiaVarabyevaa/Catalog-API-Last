import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './entities';
import {
  CreateOrderInput,
  DeleteOrderInput,
  PayOrderInput,
  UpdateOrderInput,
} from './dtos';
import { UseGuards } from '@nestjs/common';
import { AtGuard } from '../auth/guards';
import { GetCurrentUserId } from '../../common/decorators';

@Resolver('Order')
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => Boolean)
  @UseGuards(AtGuard)
  async getAllUserOrders(@GetCurrentUserId() userId: number): Promise<boolean> {
    const res = await this.orderService.getAllUserOrder(userId);
    return true;
  }

  @Query(() => Boolean)
  @UseGuards(AtGuard)
  async getLatestUserOrder(
    @GetCurrentUserId() userId: number,
  ): Promise<boolean> {
    const res = await this.orderService.getLatestUserOrder(userId);
    return true;
  }

  // @Mutation(() => Order)
  @Mutation(() => Boolean)
  @UseGuards(AtGuard)
  async createOrder(
    @Args('createOrder') createOrderInput: CreateOrderInput,
    @GetCurrentUserId() userId: number,
  ) {
    const res = await this.orderService.createOrder(createOrderInput, userId);
    return true;
  }

  @Mutation(() => Boolean)
  async deleteOrder(@Args('deleteOrder') deleteOrderInput: DeleteOrderInput) {
    const res = await this.orderService.deleteOrder(deleteOrderInput);
    return true;
  }

  @Mutation(() => Boolean)
  async payOrder(@Args('payOrder') payOrderInput: PayOrderInput) {
    const res = await this.orderService.payOrder(payOrderInput);
    return true;
  }
}

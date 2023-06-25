import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { DataSource, Repository } from 'typeorm';
import { Details, Order } from './entities';
import {CATALOG_REQUEST_SERVICE, OrderStatus, OrderStatusSaga} from './constants';
import {CreateOrderData, PayOrderData, DeleteOrderData, UserId} from './types';
import { StripeService } from '../stripe/stripe.service';
import {
  CreateOrderHelper,
  SendMessageToCartHelper,
  SendMessageToCatalogHelper,
} from './helpers';
import { CreateOrderSaga } from './sagas';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Details)
    private readonly detailsRepository: Repository<Details>,
    @Inject(CATALOG_REQUEST_SERVICE)
    private readonly catalogClient: ClientProxy,
    private readonly stripeService: StripeService,
    private readonly dataSource: DataSource,
    private readonly sendMessageToCartHelper: SendMessageToCartHelper,
    private readonly sendMessageToCatalogHelper: SendMessageToCatalogHelper,
    private readonly createOrderHelper: CreateOrderHelper,
  ) {}

  async createNewOrder(
    createOrderData: CreateOrderData,
  ): Promise<Partial<Order>> {
    const saga = new CreateOrderSaga(
      OrderStatusSaga.CREATED,
      createOrderData,
      this.dataSource,
      this.sendMessageToCartHelper,
      this.sendMessageToCatalogHelper,
      this.stripeService,
      this.createOrderHelper,
    );

    const newOrder = await saga.getState().makeOperation();
    return newOrder;
  }

  async deleteOrder(deleteOrderData: DeleteOrderData): Promise<void> {
    const saga = new CreateOrderSaga(
      OrderStatusSaga.DELETED,
      deleteOrderData,
      this.dataSource,
      this.sendMessageToCartHelper,
      this.sendMessageToCatalogHelper,
      this.stripeService,
      this.createOrderHelper,
    );

    await saga.getState().makeOperation();
  }

  async payOrder(payOrderData: PayOrderData): Promise<Partial<Order>> {
    const saga = new CreateOrderSaga(
      OrderStatusSaga.PAID,
      payOrderData,
      this.dataSource,
      this.sendMessageToCartHelper,
      this.sendMessageToCatalogHelper,
      this.stripeService,
      this.createOrderHelper,
    );

    const order = await saga.getState().makeOperation();
    return order;
  }

  async getAllOrdersByUserId({ userId }: UserId): Promise<Partial<Order>> {
    const latestOrder = await this.dataSource.manager
        .createQueryBuilder(Order, 'order')
        .leftJoinAndSelect('order.details', 'details')
        .select([
          'order.id',
          'order.status',
          'details.product_id',
          'details.quantity',
          'details.price',
        ])
        .where('order.user_id = :user_id AND order.status = :status', {
          user_id: userId,
          status: OrderStatus.SUCCEEDED
        })
        .getMany();

    return latestOrder;
  }

  async getLatestUserOrder({ userId }: UserId): Promise<Partial<Order>> {
    const latestOrder = await this.dataSource.manager
        .createQueryBuilder(Order, 'order')
        .leftJoinAndSelect('order.details', 'details')
        .select([
          'order.id',
          'order.status',
          'details.product_id',
          'details.quantity',
          'details.price',
        ])
        .where('order.user_id = :user_id AND order.status = :status', {
          user_id: userId,
          status: OrderStatus.SUCCEEDED
        })
        .getOne();

    return latestOrder;
  }
}

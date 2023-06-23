import {Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {ClientProxy} from '@nestjs/microservices';
import {DataSource, In, Repository} from 'typeorm';
import {Details, Order} from './entities';
import {CATALOG_REQUEST_SERVICE, OrderStatus} from './constants';
import {CreateOrderData, PayOrderData} from './types';
import {StripeService} from '../stripe/stripe.service';
import {getOrdersDetails} from './utils';
import {DeleteOrderData} from './types/input/delete-order-data.type';
import {CreateOrderHelper, SendMessageToCartHelper, SendMessageToCatalogHelper,} from './helpers';
import {CreateOrderSaga} from './sagas';
import {OrderStatusSaga} from "./constants/order-status-saga";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Details)
    private readonly detailsRepository: Repository<Details>,
    @Inject(CATALOG_REQUEST_SERVICE) private catalogClient: ClientProxy,
    private readonly stripeService: StripeService,
    private dataSource: DataSource,
    private sendMessageToCartHelper: SendMessageToCartHelper,
    private sendMessageToCatalogHelper: SendMessageToCatalogHelper,
    private createOrderHelper: CreateOrderHelper,
  ) {}

  async createNewOrder(createOrderData: CreateOrderData) {
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
    return true;
  }

  async deleteOrder(deleteOrderData: DeleteOrderData) {
    const saga = new CreateOrderSaga(
      OrderStatusSaga.DELETED,
      deleteOrderData,
      this.dataSource,
      this.sendMessageToCartHelper,
      this.sendMessageToCatalogHelper,
      this.stripeService,
      this.createOrderHelper,
    );

    const newOrder = await saga.getState().makeOperation();
    return true;
  }

  async payOrder(payOrderData: PayOrderData) {
    const saga = new CreateOrderSaga(
      OrderStatusSaga.PAID,
      payOrderData,
      this.dataSource,
      this.sendMessageToCartHelper,
      this.sendMessageToCatalogHelper,
      this.stripeService,
      this.createOrderHelper,
    );

    await saga.getState().makeOperation();
  }

  async getAllOrdersByUserId({ userId }: GetUserId) {
    // const orders = await this.orderRepository.find({
    //   where: {
    //     user_id: userId,
    //     status: OrderStatus.SUCCEEDED,
    //   },
    //   relations: {
    //     details: true,
    //   },
    // });
    //
    // const orderDetails = getOrdersDetails(orders);
    //
    // return true;
  }

  async getLatestUserOrder({ userId }: GetUserId) {
    const latestOrder = await this.orderRepository.find({
      where: {
        user_id: userId,
        status: In([OrderStatus.SUCCEEDED, OrderStatus.INCOMPLETE]),
      },
      order: {
        created_at: 'DESC',
      },
      relations: {
        details: true,
      },
      take: 1,
    });

    const orderDetails = getOrdersDetails(latestOrder)[0];
  }
}

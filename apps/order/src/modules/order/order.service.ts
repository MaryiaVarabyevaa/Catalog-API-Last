import {Inject, Injectable, LoggerService} from '@nestjs/common';
import {RabbitRPC} from '@golevelup/nestjs-rabbitmq';
import {InjectRepository} from '@nestjs/typeorm';
import {DataSource, In, Repository} from 'typeorm';
import {Details, Order} from './entities';
import {exchange, OrderDesc, OrderStatus, Queue, RoutingKey,} from './constants';
import {CreateOrder, GetUserId, PayOrder, UpdateOrder} from './types';
import {StripeService} from '../stripe/stripe.service';
import {getOrdersDetails, makePaymentDesc, recreateOrderData} from './utils';
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';
import {GetOrderId} from './types/get-order-id.type';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Details)
    private readonly detailsRepository: Repository<Details>,
    private readonly stripeService: StripeService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    // предоставляет пул соединения к бд
    private dataSource: DataSource,
  ) {}

  @RabbitRPC({
    exchange,
    routingKey: RoutingKey.CREATE_ORDER,
    queue: Queue.CREATE_ORDER,
  })
  async handleCreateOrder(order: CreateOrder) {
    const res = await this.createOrder(order);

    return true;
  }

  @RabbitRPC({
    exchange,
    routingKey: RoutingKey.UPDATE_ORDER,
    queue: Queue.UPDATE_ORDER,
  })
  async handleUpdateOrderInfo(order: UpdateOrder) {
    const orderInfo = makePaymentDesc(order, OrderDesc.UPDATE_ORDER);
    const { payment_id: paymentId } = await this.orderRepository.findOne({
      where: { id: order.id },
    });

    if (!paymentId) {
      return null;
    }
    await this.stripeService.updateOrder(paymentId, orderInfo);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const oldOrder = await queryRunner.manager.findOne(Order, {
        where: { id: order.id },
      });

      oldOrder.currency = order.currency;

      const updatedOrder = await queryRunner.manager.save(oldOrder);

      await queryRunner.manager.delete(Details, { order_id: order.id });

      const details = order.products.map((product) => {
        const orderDetail = new Details();
        orderDetail.order_id = updatedOrder.id;
        orderDetail.product_id = product.productId;
        orderDetail.price = product.price;
        orderDetail.quantity = product.quantity;
        return orderDetail;
      });

      await queryRunner.manager.save(Details, details);
      await queryRunner.commitTransaction();

      this.logger.log(`Order updated successfully: ${JSON.stringify(order)}`);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error updating order: ${err.message}`);
    } finally {
      await queryRunner.release();
    }

    return true;
  }

  @RabbitRPC({
    exchange,
    routingKey: RoutingKey.DELETE_ORDER,
    queue: Queue.DELETE_ORDER,
  })
  async handleDeleteOrder({ id }: GetOrderId) {
    const { payment_id: paymentId } = await this.orderRepository.findOne({
      where: { id },
    });
    if (!paymentId) {
      return null;
    }
    await this.stripeService.deleteOrder(paymentId);

    const order = await this.orderRepository.update(id, {
      status: OrderStatus.CANCELED,
    });

    return true;
  }

  @RabbitRPC({
    exchange,
    routingKey: RoutingKey.PAY_ORDER,
    queue: Queue.PAY_ORDER,
  })
  async handlePayOrder({ id, paymentMethodId }: PayOrder) {
    try {
      const order = await this.orderRepository.findOne({ where: { id } });
      if (!order) {
        return null;
      }

      let orderId = id;
      let paymentId = order.payment_id;
      let newStatus: OrderStatus;

      if (order.status === OrderStatus.CANCELED) {
        const options = await this.recreateOrder(id);
        paymentId = options.paymentId;
        orderId = options.id;
      }

      const payment = await this.stripeService.payOrder(
        paymentId,
        paymentMethodId,
      );

      newStatus = payment && payment.status === OrderStatus.SUCCEEDED
          ? OrderStatus.SUCCEEDED
          : OrderStatus.CANCELED;

      await this.orderRepository.update(
        { id: orderId },
        { status: newStatus },
      );

      return true;
    } catch (err) {
      this.logger.error(`Error paying order: ${err.message}`);
      return null;
    }
  }

  @RabbitRPC({
    exchange,
    routingKey: RoutingKey.GET_ALL_ORDER_BY_USER_ID,
    queue: Queue.GET_ALL_ORDERS_BY_USER_IS,
  })
  async handleGetAllOrdersByUserId({ userId }: GetUserId) {
    const orders = await this.orderRepository.find({
      where: {
        user_id: userId,
        status: OrderStatus.SUCCEEDED
      },
      relations: {
        details: true,
      },
    });

    const orderDetails = getOrdersDetails(orders);

    return true;
  }

  @RabbitRPC({
    exchange,
    routingKey: RoutingKey.GET_ORDER_BY_USER_ID,
    queue: Queue.GET_ORDER_BY_USER_ID,
  })
  async handleGetLatestUserOrder({ userId }: GetUserId) {
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
      take: 1
    });

    const orderDetails = getOrdersDetails(latestOrder)[0];

    console.log(orderDetails)
  }

  private async createOrder(order: CreateOrder) {
    const orderInfo = makePaymentDesc(order, OrderDesc.CREATE_ORDER);
    const payment = await this.stripeService.createOrder(orderInfo);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newOrder = new Order();
      newOrder.user_id = order.userId;
      newOrder.currency = order.currency;
      newOrder.payment_id = payment.id;

      const savedOrder = await queryRunner.manager.save(newOrder);

      const details = order.products.map((product) => {
        const orderDetail = new Details();
        orderDetail.order_id = savedOrder.id;
        orderDetail.product_id = product.productId;
        orderDetail.price = product.price;
        orderDetail.quantity = product.quantity;
        return orderDetail;
      });

      await queryRunner.manager.save(Details, details);

      await queryRunner.commitTransaction();

      this.logger.log(`Order created successfully: ${JSON.stringify(order)}`);

      return {
        id: savedOrder.id,
        paymentId: payment.id,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Error creating order: ${err.message}`);
    } finally {
      await queryRunner.release();
    }
  }




  private async recreateOrder(id: number) {
    const order = await this.orderRepository.findOne({
      where: {
        id,
      },
      relations: {
        details: true,
      },
    });

    const newOrderInfo = recreateOrderData(order);
    const orderInfo = await this.createOrder(newOrderInfo);
    return orderInfo;
  }
}

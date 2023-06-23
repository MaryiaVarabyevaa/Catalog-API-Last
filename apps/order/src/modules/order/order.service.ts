import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { DataSource, In, Repository } from 'typeorm';
import { Details, Order } from './entities';
import { CATALOG_REQUEST_SERVICE, OrderDesc, OrderStatus } from './constants';
import {
  CreateOrderData,
  GetUserId,
  PayOrderData,
  UpdateOrderData,
} from './types';
import { StripeService } from '../stripe/stripe.service';
import { getOrdersDetails, makePaymentDesc, recreateOrderData } from './utils';
import { GetOrderId } from './types/get-order-id.type';
import { SendMessageToCartHelper, SendMessageToCatalogHelper } from './helpers';
import { CreateOrderSaga } from './sagas';

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
  ) {}

  async createNewOrder(createOrderData: CreateOrderData) {
    const saga = new CreateOrderSaga(
      OrderStatus.INCOMPLETE,
      createOrderData,
      this.dataSource,
      this.sendMessageToCartHelper,
      this.sendMessageToCatalogHelper,
    );

    const newOrder = await saga.getState().makeOperation();
    return true;
  }

  async updateOrderInfo(order: UpdateOrderData) {
    // const orderInfo = makePaymentDesc(order, OrderDesc.UPDATE_ORDER);
    // const { payment_id: paymentId } = await this.orderRepository.findOne({
    //   where: { id: order.id },
    // });
    //
    // if (!paymentId) {
    //   return null;
    // }
    // await this.stripeService.updateOrder(paymentId, orderInfo);
    //
    // const queryRunner = this.dataSource.createQueryRunner();
    //
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    //
    // try {
    //   const oldOrder = await queryRunner.manager.findOne(Order, {
    //     where: { id: order.id },
    //   });
    //
    //   oldOrder.currency = order.currency;
    //
    //   const updatedOrder = await queryRunner.manager.save(oldOrder);
    //
    //   await queryRunner.manager.delete(Details, { order_id: order.id });
    //
    //   const details = order.products.map((product) => {
    //     const orderDetail = new Details();
    //     orderDetail.order_id = updatedOrder.id;
    //     orderDetail.product_id = product.productId;
    //     orderDetail.price = product.price;
    //     orderDetail.quantity = product.quantity;
    //     return orderDetail;
    //   });
    //
    //   await queryRunner.manager.save(Details, details);
    //   await queryRunner.commitTransaction();
    // } catch (err) {
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   await queryRunner.release();
    // }

    return true;
  }

  async deleteOrder({ id }: GetOrderId) {
    // const { payment_id: paymentId } = await this.orderRepository.findOne({
    //   where: { id },
    // });
    // if (!paymentId) {
    //   return null;
    // }
    // await this.stripeService.deleteOrder(paymentId);
    //
    // const order = await this.orderRepository.update(id, {
    //   status: OrderStatus.CANCELED,
    // });
    //
    // return true;
  }

  async payOrder({ id, paymentMethodId }: PayOrderData) {
    // try {
    //   const order = await this.orderRepository.findOne({ where: { id } });
    //   if (!order) {
    //     return null;
    //   }
    //
    //   let orderId = id;
    //   let paymentId = order.payment_id;
    //   let newStatus: OrderStatus;
    //
    //   if (order.status === OrderStatus.CANCELED) {
    //     const options = await this.recreateOrder(id);
    //     paymentId = options.paymentId;
    //     orderId = options.id;
    //   }
    //
    //   const payment = await this.stripeService.payOrder(
    //     paymentId,
    //     paymentMethodId,
    //   );
    //
    //   newStatus =
    //     payment && payment.status === OrderStatus.SUCCEEDED
    //       ? OrderStatus.SUCCEEDED
    //       : OrderStatus.CANCELED;
    //
    //   await this.orderRepository.update({ id: orderId }, { status: newStatus });
    //
    //   return true;
    // } catch (err) {
    //   return null;
    // }
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

  private async createOrder(order: CreateOrderData) {
    // const orderInfo = makePaymentDesc(order, OrderDesc.CREATE_ORDER);
    // const payment = await this.stripeService.createOrder(orderInfo);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newOrder = new Order();
      newOrder.user_id = order.userId;
      newOrder.currency = order.currency;
      newOrder.payment_id = payment.id;

      const savedOrder = await queryRunner.manager.save(newOrder);

      const details = order.products.map(async (product) => {
        //
        // const isEnoughQuantity = await this.checkProductQuantity(product.productId, product.quantity);
        //
        // if (!isEnoughQuantity) {
        //   throw RpcException("")
        // }
        //
        const orderDetail = new Details();
        orderDetail.order_id = savedOrder.id;
        orderDetail.product_id = product.productId;
        orderDetail.price = product.price;
        orderDetail.quantity = product.quantity;
        return orderDetail;
      });

      await queryRunner.manager.save(Details, details);

      await queryRunner.commitTransaction();

      return {
        id: savedOrder.id,
        paymentId: payment.id,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      // order.products.map(async ({ productId, quantity }) => {
      //   await this.changeProductQuantity(productId, quantity);
      // });
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

  // private async checkProductQuantity(productId: number, quantity: number) {
  //   const isEnoughQuantity = await this.sendMessageToAuthClient(
  //     Pattern.CHECK_PRODUCT_QUANTITY,
  //     {
  //       productId,
  //       quantity,
  //     },
  //   );
  //
  //   return isEnoughQuantity;
  // }

  // private async changeProductQuantity(productId: number, quantity: number) {
  //   const changedProductQuantity = await this.sendMessageToAuthClient(
  //     Pattern.CHANGE_PRODUCT_QUANTITY,
  //     {
  //       productId,
  //       quantity,
  //     },
  //   );
  //
  //   return changedProductQuantity;
  // }
  //
  // private async sendMessageToAuthClient(msg: string, data: any) {
  //   const pattern = { cmd: msg };
  //   return await this.catalogClient.send(pattern, { data }).toPromise();
  // }
}

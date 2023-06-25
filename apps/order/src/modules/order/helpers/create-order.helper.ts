import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { GetProductInfo, Product } from '../types';
import { Details, Order } from '../entities';
import { OrderStatus } from '../constants';

@Injectable()
export class CreateOrderHelper {
  constructor(private dataSource: DataSource) {}

  async createNewOrder(
    cart: GetProductInfo,
    paymentId: string,
  ): Promise<Partial<Order>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newOrder = this.createOrder(cart, paymentId);
      const savedOrder = await queryRunner.manager.save(newOrder);

      const detailsPromises = cart.details.map((productInfo) => {
        const newDetail = this.createDetails(productInfo, savedOrder.id);
        return queryRunner.manager.save(newDetail);
      });

      await Promise.all(detailsPromises);

      await queryRunner.commitTransaction();

      const order = await this.findOrder(savedOrder.id, queryRunner);

      return order;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private createOrder(cart: GetProductInfo, paymentId: string) {
    const newOrder = new Order();
    newOrder.user_id = cart.user_id;
    newOrder.currency = cart.currency;
    newOrder.status = OrderStatus.INCOMPLETE;
    newOrder.payment_id = paymentId;
    return newOrder;
  }

  private createDetails(productInfo: Product, orderId: number) {
    const newDetail = new Details();
    newDetail.product_id = productInfo.product_id;
    newDetail.quantity = productInfo.quantity;
    newDetail.price = productInfo.price;
    newDetail.order_id = orderId;
    return newDetail;
  }

   async findOrder(
    id: number,
    queryRunner: QueryRunner,
  ): Promise<Partial<Order>> {
    const order = await queryRunner.manager
      .createQueryBuilder(Order, 'order')
      .leftJoinAndSelect('order.details', 'details')
      .select([
        'order.id',
        'order.status',
        'details.product_id',
        'details.quantity',
        'details.price',
      ])
      .where('order.id = :id', { id })
      .getOne();

    return order;
  }
}

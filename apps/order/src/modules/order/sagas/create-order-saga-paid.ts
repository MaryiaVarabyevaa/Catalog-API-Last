import { CreateOrderState } from './create-order.state';
import { Order } from '../entities';
import { PayOrderData } from '../types';
import { OrderDesc, OrderStatus } from '../constants';
import { makePaymentDesc, transformData } from '../utils';

export class CreateOrderSagaPaid extends CreateOrderState {
  async makeOperation(): Promise<any> {
    const { id, paymentMethodId } = this.saga.data as PayOrderData;
    const queryRunner = this.saga.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = (await queryRunner.manager.findOne(Order, {
        where: { id },
        relations: ['details'],
      })) as Order;

      if (order.status === OrderStatus.CANCELED) {
        throw new Error('');
      }

      const paidOrder = await this.saga.stripeService.payOrder(
        order.payment_id,
        paymentMethodId,
      );

      if (!paidOrder) {
        const paymentData = makePaymentDesc(
          transformData(order),
          OrderDesc.CREATE_ORDER,
        );
        const newPayment = await this.saga.stripeService.createOrder(
          paymentData,
        );

        order.payment_id = newPayment.id;
        await queryRunner.manager.save(order);
      }

      if (paidOrder && paidOrder.status === OrderStatus.SUCCEEDED) {
        order.status = OrderStatus.SUCCEEDED;
        await queryRunner.manager.save(Order, order);
      }

      await queryRunner.commitTransaction();
      return;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

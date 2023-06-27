import { CreateOrderState } from './create-order.state';
import { Order } from '../entities';
import { getProductInfo } from '../utils';
import { Operation, OrderStatus } from '../constants';
import { DeleteOrderData, ProductInfo } from '../types';
import { winstonLoggerConfig } from '@app/common';

export class CreateOrderSagaDeleted extends CreateOrderState {
  async makeOperation(): Promise<any> {
    const { id, cartId } = this.saga.data as DeleteOrderData;
    let productInfo: ProductInfo[];
    const queryRunner = this.saga.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = (await queryRunner.manager.findOne(Order, {
        where: { id },
        relations: ['details'],
      })) as Order;

      productInfo = getProductInfo(order);
      await this.saga.sendMessageToCartHelper.rollbackGetCart({ cartId });
      await this.saga.sendMessageToCatalogHelper.checkProductQuantity({
        operation: Operation.ADD,
        data: productInfo,
      });

      order.status = OrderStatus.CANCELED;
      await queryRunner.manager.save(order);

      await this.saga.sendMessageToCatalogHelper.commitProductQuantity(
        productInfo,
      );
      await queryRunner.commitTransaction();

      winstonLoggerConfig.info(`Deleted order with id ${id}`);
    } catch (err) {
      await this.rollback(cartId, productInfo);
      await queryRunner.rollbackTransaction();

      winstonLoggerConfig.error(
        `Failed to delete order with id ${id}: ${err.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  private async rollback(cartId: number, productInfo: ProductInfo[]) {
    await Promise.all([
      this.saga.sendMessageToCartHelper.clearCart({ cartId }),
      this.saga.sendMessageToCatalogHelper.rollbackProductQuantity(productInfo),
    ]);
  }
}

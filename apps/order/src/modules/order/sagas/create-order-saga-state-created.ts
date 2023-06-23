import {CreateOrderState} from './create-order.state';
import {CreateOrderData, GetProductInfo} from '../types';
import {getProductInfo} from '../utils';
import {Order} from "../entities";

export class CreateOrderSagaStateCreated extends CreateOrderState {
  async makeOperation(): Promise<any> {
    const cartId = this.saga.data as CreateOrderData;
    const queryRunner = this.saga.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const cart: GetProductInfo = await this.saga.sendMessageToCartHelper.getCart(cartId);

      const productInfo = getProductInfo(cart);

      const checkedQuantity =
        await this.saga.sendMessageToCatalogHelper.checkProductQuantity(
          productInfo,
        );

      // вставить оплату

      const newOrder = new Order();
      newOrder.user_id = cart.user_id;
      newOrder.currency = cart.currency;

      

      await queryRunner.commitTransaction();
      //
      // return savedProduct;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      // await this.saga.sendMessageHelper.rollbackDeleteNewProduct({
      //     id: product.id,
      // });
    } finally {
      await queryRunner.release();
    }
  }
}

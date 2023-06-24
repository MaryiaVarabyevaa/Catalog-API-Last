import { CreateOrderState } from './create-order.state';
import { CreateOrderData, GetProductInfo, ProductInfo } from '../types';
import { getProductInfo, makePaymentDesc } from '../utils';
import { Operation, OrderDesc } from '../constants';

export class CreateOrderSagaStateCreated extends CreateOrderState {
  async makeOperation(): Promise<any> {
    const cartId = this.saga.data as CreateOrderData;
    let productInfo: ProductInfo[];
    let paymentId: string;
    const queryRunner = this.saga.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const cart: GetProductInfo =
        await this.saga.sendMessageToCartHelper.getCart(cartId);

      productInfo = getProductInfo(cart);

      await this.saga.sendMessageToCatalogHelper.checkProductQuantity({
        operation: Operation.SUB,
        data: productInfo,
      });

      const orderInfo = makePaymentDesc(cart, OrderDesc.CREATE_ORDER);

      const payment = await this.saga.stripeService.createOrder(orderInfo);
      paymentId = payment.id;

      await this.saga.createOrderHelper.createNewOrder(cart, paymentId);

      await this.commit(cartId, productInfo);
      await queryRunner.commitTransaction();
    } catch (err) {
      await this.rollback(cartId, productInfo, paymentId);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async commit(cartId: CreateOrderData, productInfo: ProductInfo[]) {
    await Promise.all([
      this.saga.sendMessageToCartHelper.commitGetCart(cartId),
      this.saga.sendMessageToCatalogHelper.commitProductQuantity(productInfo),
    ]);
  }

  private async rollback(
    cartId: CreateOrderData,
    productInfo: ProductInfo[],
    paymentId: string,
  ) {
    await Promise.all([
      this.saga.sendMessageToCartHelper.rollbackGetCart(cartId),
      this.saga.sendMessageToCatalogHelper.rollbackProductQuantity(productInfo),
      this.saga.stripeService.deleteOrder(paymentId),
    ]);
  }
}

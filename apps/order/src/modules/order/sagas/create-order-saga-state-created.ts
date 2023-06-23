import { CreateOrderState } from './create-order.state';
import {CreateOrderData, GetProductInfo, Product, ProductInfo} from '../types';
import { getProductInfo, makePaymentDesc } from '../utils';
import { Details, Order } from '../entities';
import { OrderDesc, OrderStatus } from '../constants';

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

      await this.saga.sendMessageToCatalogHelper.checkProductQuantity(
        productInfo,
      );

      const orderInfo = makePaymentDesc(cart, OrderDesc.CREATE_ORDER);

      const payment = await this.saga.stripeService.createOrder(orderInfo);
      paymentId = payment.id;

      const newOrder = this.createOrder(cart, paymentId);
      const savedOrder = await queryRunner.manager.save(newOrder);

      const detailsPromises = cart.details.map((productInfo) => {
        const newDetail = this.createDetails(productInfo, savedOrder.id)
        return queryRunner.manager.save(newDetail);
      });
      await Promise.all(detailsPromises);

      await this.commit(cartId, productInfo);
      await queryRunner.commitTransaction();
    } catch (err) {
      await this.rollback(cartId, productInfo, paymentId);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }


  private createOrder(cart: GetProductInfo, paymentId: string): Order {
    const newOrder = new Order();
    newOrder.user_id = cart.user_id;
    newOrder.currency = cart.currency;
    newOrder.status = OrderStatus.INCOMPLETE;
    newOrder.payment_id = paymentId;
    return newOrder;
  }


  private createDetails(productInfo: Product, orderId: number): Details {
    const newDetail = new Details();
    newDetail.product_id = productInfo.product_id;
    newDetail.quantity = productInfo.quantity;
    newDetail.price = productInfo.price;
    newDetail.order_id = orderId;
    return newDetail;
  }

  private async commit(cartId: CreateOrderData, productInfo: ProductInfo[]) {
    await Promise.all([
      this.saga.sendMessageToCartHelper.commitGetCart(cartId),
      this.saga.sendMessageToCatalogHelper.commitProductQuantity(
        productInfo,
      ),
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

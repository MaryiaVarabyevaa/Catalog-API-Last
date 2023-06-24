import { DataSource } from 'typeorm';
import { CreateOrderState } from './create-order.state';
import {
  CreateOrderHelper,
  SendMessageToCartHelper,
  SendMessageToCatalogHelper,
} from '../helpers';
import { Data } from '../types';
import { CreateOrderSagaStateCreated } from './create-order-saga-state-created';
import { StripeService } from '../../stripe/stripe.service';
import { CreateOrderSagaPaid } from './create-order-saga-paid';
import { CreateOrderSagaDeleted } from './create-order-saga-deleted';
import { OrderStatusSaga } from '../constants/order-status-saga';

export class CreateOrderSaga {
  public state: CreateOrderState;

  constructor(
    public state: OrderStatusSaga,
    public data: Data,
    public dataSource: DataSource,
    public sendMessageToCartHelper: SendMessageToCartHelper,
    public sendMessageToCatalogHelper: SendMessageToCatalogHelper,
    public stripeService: StripeService,
    public createOrderHelper: CreateOrderHelper,
  ) {
    this.setState(state);
  }

  setState(state: OrderStatusSaga) {
    switch (state) {
      case OrderStatusSaga.CREATED:
        this.state = new CreateOrderSagaStateCreated();
        break;
      case OrderStatusSaga.PAID:
        this.state = new CreateOrderSagaPaid();
        break;
      case OrderStatusSaga.DELETED:
        this.state = new CreateOrderSagaDeleted();
        break;
    }

    this.state.setContext(this);
  }

  getState() {
    return this.state;
  }
}

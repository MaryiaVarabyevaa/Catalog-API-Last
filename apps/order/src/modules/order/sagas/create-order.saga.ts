import { DataSource } from 'typeorm';
import { OrderStatus } from '../constants';
import { CreateOrderState } from './create-order.state';
import {
  SendMessageToCartHelper,
  SendMessageToCatalogHelper,
} from '../helpers';
import { Data } from '../types';
import { CreateOrderSagaStateCreated } from './create-order-saga-state-created';
import { StripeService } from '../../stripe/stripe.service';

export class CreateOrderSaga {
  public state: CreateOrderState;

  constructor(
    public state: OrderStatus,
    public data: Data,
    public dataSource: DataSource,
    public sendMessageToCartHelper: SendMessageToCartHelper,
    public sendMessageToCatalogHelper: SendMessageToCatalogHelper,
    public stripeService: StripeService,
  ) {
    this.setState(state);
  }

  setState(state: OrderStatus) {
    switch (state) {
      case OrderStatus.INCOMPLETE:
        this.state = new CreateOrderSagaStateCreated();
        break;
      case OrderStatus.SUCCEEDED:
        break;
      case OrderStatus.CANCELED:
        break;
    }

    this.state.setContext(this);
  }

  getState() {
    return this.state;
  }
}

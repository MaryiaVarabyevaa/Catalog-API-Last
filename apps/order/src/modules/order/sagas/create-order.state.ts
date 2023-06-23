import { CreateOrderSaga } from './create-order.saga';

export abstract class CreateOrderState {
  public saga: CreateOrderSaga;

  public setContext(saga: CreateOrderSaga) {
    this.saga = saga;
  }

  public abstract makeOperation(): Promise<any>;
}

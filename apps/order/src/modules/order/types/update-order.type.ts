import { CreateOrder } from './create-order.type';

export interface UpdateOrder extends CreateOrder {
  id: number;
}

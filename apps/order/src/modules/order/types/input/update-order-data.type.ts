import { CreateOrder } from './create-order-data.type';

export interface UpdateOrder extends CreateOrder {
  id: number;
}

import { IOrder } from './input/create-order-data.type';
import { OrderStatus } from '../constants';

export interface UserOrderDetails {
  id: number;
  status: OrderStatus;
  currency: string;
  products: IOrder[];
}

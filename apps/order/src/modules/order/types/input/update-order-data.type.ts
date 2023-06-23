import { CreateOrderData } from './create-order-data.type';

export interface UpdateOrderData extends CreateOrderData {
  id: number;
}

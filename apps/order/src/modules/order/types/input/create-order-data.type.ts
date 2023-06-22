import { Currency } from './currency.type';

export interface IOrder {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderData {
  userId: number;
  products: IOrder[];
  currency: Currency;
}

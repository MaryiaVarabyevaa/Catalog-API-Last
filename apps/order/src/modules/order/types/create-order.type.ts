import { Currency } from './currency.type';

export interface IOrder {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrder {
  userId: number;
  products: IOrder[];
  currency: Currency;
}

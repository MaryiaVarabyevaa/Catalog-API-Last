import { Currency } from '../currency.type';

export interface CreateProduct {
  name: string;
  description: string;
  currency: Currency;
  price: number;
  totalQuantity: number;
}

import { Currency } from '../currency.type';

export interface CreateProductData {
  name: string;
  description: string;
  currency: Currency;
  price: number;
  totalQuantity: number;
}

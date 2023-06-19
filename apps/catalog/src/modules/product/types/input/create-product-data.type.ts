import { Currency } from '../currency.type';

export interface CreateProductType {
  name: string;
  description: string;
  currency: Currency;
  price: number;
  totalQuantity: number;
}

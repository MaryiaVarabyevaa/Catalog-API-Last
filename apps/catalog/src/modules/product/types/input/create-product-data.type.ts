import { Currency } from '../currency.type';

export interface CreateProductData {
  name: string;
  description: string;
  currency: Currency;
  img_url: string;
  price: number;
  totalQuantity: number;
}

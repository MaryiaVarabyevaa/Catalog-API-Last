import { Currency } from '../constants';

export interface GetProductInfo {
  id?: number;
  user_id?: number;
  currency: Currency;
  details: Product[];
}

export interface Product {
  id?: number;
  cart_id?: number;
  product_id?: number;
  quantity: number;
  price: number;
}

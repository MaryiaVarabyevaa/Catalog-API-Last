import { ProductInfo } from './product-info.type';

export interface GetProductInfo {
  id: number;
  user_id: number;
  currency: string;
  details: Product[];
}

export interface Product {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

import { CreateProductData } from './input/create-product-data.type';
import { UpdateProductData } from './input/update-product-data.type';
import { ClearCartData } from './input/clear-cart-data.type';
import { GetCurrentCartData } from './get-current-cart-data.type';
import { GetCurrentCartToOrderData } from './get-current-cart-to-order-data.type';

export type Data =
  | CreateProductData
  | UpdateProductData
  | ClearCartData
  | GetCurrentCartData
  | GetCurrentCartToOrderData;

import { Currency } from '../../constants';

export interface CreateProductData {
  userId: number;
  productId: number;
  currency: Currency;
  quantity: number;
  price: number;
  newCart?: boolean;
}

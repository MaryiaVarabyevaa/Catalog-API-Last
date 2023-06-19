import { CreateProduct } from './create-product.type';

export interface UpdateProduct extends CreateProduct {
  id: number;
}

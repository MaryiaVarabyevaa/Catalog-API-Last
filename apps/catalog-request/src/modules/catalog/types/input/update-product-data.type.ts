import { CreateProduct } from './create-product-data.type';

export interface UpdateProduct extends CreateProduct {
  id: number;
}

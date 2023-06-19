import { CreateProductData } from './create-product-data.type';

export interface UpdateProductData extends CreateProductData {
  id: number;
}

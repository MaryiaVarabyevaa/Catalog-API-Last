import { ProductInfo } from './product-info.type';

export interface UpdateQuantityData {
  operation: string;
  data: ProductInfo[];
}

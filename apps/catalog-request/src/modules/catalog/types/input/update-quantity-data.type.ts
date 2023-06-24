import { ProductInfo } from '../product-info';

export interface UpdateQuantityData {
  operation: string;
  data: ProductInfo[];
}

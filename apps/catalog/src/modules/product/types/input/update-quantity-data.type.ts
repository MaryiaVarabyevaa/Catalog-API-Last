import { QuantityData } from '../quantity-data.type';

export interface UpdateQuantityData {
  operation: string;
  data: QuantityData[];
}

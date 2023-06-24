import { CreateProductData } from './input/create-product-data.type';
import { UpdateProductData } from './input/update-product-data.type';
import { DeleteProductData } from './input/delete-product-data.type';
import { UpdateQuantityData } from './input/update-quantity-data.type';
import { QuantityData } from './quantity-data.type';

export type Data = {
  data:
    | CreateProductData
    | UpdateProductData
    | DeleteProductData
    | UpdateQuantityData
    | QuantityData[];
};

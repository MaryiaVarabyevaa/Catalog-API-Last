import { CreateProductData } from './input/create-product-data.type';
import { UpdateProductData } from './input/update-product-data.type';
import { DeleteProductData } from './input/delete-product-data.type';

export type Data = {
  data:
    | CreateProductData
    | UpdateProductData
    | DeleteProductData
    | UpdateProductData;
};

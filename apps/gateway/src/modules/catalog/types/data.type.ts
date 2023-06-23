import {
  CreateProductInput,
  DeleteProductInput,
  UpdateProductInput,
} from '../dtos';

export type Data = CreateProductInput | UpdateProductInput | DeleteProductInput;

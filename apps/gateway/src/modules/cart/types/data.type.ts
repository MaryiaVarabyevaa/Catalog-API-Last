import {
  AddProductInput,
  ClearCartInput,
  UpdateProductInCartInput,
} from '../dtos';
import { DeleteOrderInput } from '../../order/dtos';
import { UserId } from './user-id.type';

export type Data =
  | ((AddProductInput | UpdateProductInCartInput | DeleteOrderInput) & UserId)
  | UserId
  | ClearCartInput;

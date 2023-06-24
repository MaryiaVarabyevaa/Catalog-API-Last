import {
  CreateOrderInput,
  DeleteOrderInput,
  PayOrderInput,
  UpdateOrderInput,
} from '../dtos';
import { UserId } from './user-id.type';

export type Data =
  | ((CreateOrderInput | UpdateOrderInput) & UserId)
  | DeleteOrderInput
  | UserId
  | PayOrderInput;

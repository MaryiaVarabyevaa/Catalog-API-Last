import { CreateOrderInput, GetOrderIdInput, UpdateOrderInput } from '../dtos';
import { UserId } from './user-id.type';

export type Data =
  | ((CreateOrderInput | UpdateOrderInput) & UserId)
  | GetOrderIdInput
  | UserId;

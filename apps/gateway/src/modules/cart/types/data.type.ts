import { AddProductInput } from '../dtos';
import { UpdateProductInput } from '../../catalog/dtos';
import { GetOrderIdInput } from '../../order/dtos';
import { UserId } from './user-id.type';

export type Data =
  | ((AddProductInput | UpdateProductInput | GetOrderIdInput) & UserId)
  | UserId;

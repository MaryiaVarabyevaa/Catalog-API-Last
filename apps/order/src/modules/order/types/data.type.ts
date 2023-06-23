import { CreateOrderData } from './input/create-order-data.type';
import { UpdateOrderData } from './input/update-order-data.type';
import { PayOrderData } from './input/pay-order-data.type';

export type Data = CreateOrderData | UpdateOrderData | PayOrderData;

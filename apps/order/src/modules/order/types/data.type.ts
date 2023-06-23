import { CreateOrderData } from './input/create-order-data.type';
import { PayOrderData } from './input/pay-order-data.type';
import { DeleteOrderData } from './input/delete-order-data.type';
import {ClearCart} from "./clear-cart.type";

export type Data = CreateOrderData | PayOrderData | DeleteOrderData | ClearCart;

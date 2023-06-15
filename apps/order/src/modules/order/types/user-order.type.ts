import {IOrder} from "./create-order.type";
import {OrderStatus} from "../constants";

export interface UserOrderDetails {
    id: number,
    status: OrderStatus,
    currency: string,
    products: IOrder[],
}
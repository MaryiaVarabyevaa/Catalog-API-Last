import { GetOrderId } from './get-order-id.type';

export interface PayOrder extends GetOrderId {
  paymentMethodId: string;
}

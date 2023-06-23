import { GetOrderId } from './order-id.type';

export interface PayOrderData extends GetOrderId {
  paymentMethodId: string;
}

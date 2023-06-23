import { GetOrderId } from '../get-order-id.type';

export interface PayOrderData extends GetOrderId {
  paymentMethodId: string;
}

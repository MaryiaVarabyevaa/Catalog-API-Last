import { CreateOrder, Order } from '../types';

export const makePaymentDesc = (
  { currency, products }: CreateOrder,
  description: string,
): Partial<Order> => {
  let amount = +products
    .reduce((sum, { price, quantity }) => sum + price * quantity, 0)
    .toFixed(2);
  return {
    amount,
    currency,
    description,
  };
};

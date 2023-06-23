import { GetProductInfo, Order } from '../types';

export const makePaymentDesc = (
  { currency, details }: GetProductInfo,
  description: string,
): Partial<Order> => {
  let amount = +details
    .reduce((sum, { price, quantity }) => sum + price * quantity, 0)
    .toFixed(2);
  return {
    amount,
    currency,
    description,
  };
};

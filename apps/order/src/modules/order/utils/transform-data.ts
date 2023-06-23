import { Order } from '../entities';

export const transformData = (data: Order) => {
  const res = {
    currency: data.currency,
    details: [],
  };

  data.details.forEach(({ quantity, price }) => {
    res.details.push({
      quantity,
      price,
    });
  });

  return res;
};

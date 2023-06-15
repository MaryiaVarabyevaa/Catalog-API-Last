import { Order } from '../entities';
import { CreateOrder } from '../types';

export const recreateOrderData = ({
  user_id,
  currency,
  details,
}: Order): CreateOrder => {
  const newOrder = {
    userId: user_id,
    currency,
    products: [],
  };

  details.forEach(({ product_id, price, quantity }) => {
    newOrder.products.push({
      productId: product_id,
      price,
      quantity,
    });
  });

  return newOrder as CreateOrder;
};

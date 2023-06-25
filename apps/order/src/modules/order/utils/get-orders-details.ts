import { Order } from '../entities';
import { ProductInfo } from '../types';

export const getOrdersDetails = (orders: Order[]) => {
  const values = orders.map((order) => ({
    id: order.id,
    status: order.status,
    currency: order.currency,
    products: order.details.map((product) => ({
      productId: product.product_id,
      quantity: product.quantity,
      price: product.price,
    })),
  }));

  return values;
};

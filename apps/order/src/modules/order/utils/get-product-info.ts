import { GetProductInfo, ProductInfo } from '../types';
import { Order } from '../entities';

export const getProductInfo = (data: GetProductInfo | Order): ProductInfo[] => {
  const productInfo = data.details.map(({ product_id, quantity }) => ({
    productId: product_id,
    rightQuantity: quantity,
  }));

  return productInfo;
};

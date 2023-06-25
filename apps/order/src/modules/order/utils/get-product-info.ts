import { GetProductInfo, ProductInfo } from '../types';
import { Order } from '../entities';

export const getProductInfo = (data: GetProductInfo): ProductInfo[] => {
  const productInfo: ProductInfo[] = data.details.map(
    ({ product_id, quantity }) => ({
      productId: product_id,
      rightQuantity: quantity,
    }),
  );

  return productInfo;
};

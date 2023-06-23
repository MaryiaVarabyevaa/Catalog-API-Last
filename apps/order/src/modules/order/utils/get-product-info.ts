import { GetProductInfo, ProductInfo } from '../types';

export const getProductInfo = (data: GetProductInfo): ProductInfo[] => {
  const productInfo = data.details.map(({ product_id, quantity }) => ({
    productId: product_id,
    rightQuantity: quantity,
  }));

  return productInfo;
};

export interface CreateProductData {
  userId: number;
  productId: number;
  currency: string;
  quantity: number;
  price: number;
  newCart?: boolean;
  id?: number;
}

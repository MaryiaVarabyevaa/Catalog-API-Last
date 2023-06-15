import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { Currency } from '../../constants';

@InputType()
export class UpdateOrderInput {
  @Field(() => ID)
  id: number;

  @Field(() => Currency)
  currency: Currency;

  @Field(() => [ProductUpdateInput])
  products: ProductUpdateInput[];
}

@InputType()
export class ProductUpdateInput {
  @Field(() => ID)
  productId: number;

  @Field(() => Float)
  quantity: number;

  @Field(() => Float)
  price: number;
}

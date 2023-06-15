import { Field, InputType, ID, Float } from '@nestjs/graphql';
import { Currency } from '../../constants';

@InputType()
export class CreateOrderInput {
  @Field(() => [ProductInput])
  products: ProductInput[];

  @Field(() => Currency)
  currency: Currency;
}

@InputType()
export class ProductInput {
  @Field(() => ID)
  productId: number;

  @Field(() => Float)
  quantity: number;

  @Field(() => Float)
  price: number;
}

import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Currency, OrderStatus } from '../constants';

@ObjectType()
export class Order {
  @Field(() => ID)
  id: number;

  @Field()
  status: string;

  @Field(() => [Product])
  products: Product[];
}

@ObjectType()
export class Product {
  @Field(() => ID)
  productId: number;

  @Field()
  name: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;

  @Field(() => Currency)
  currency: Currency;
}

import { Directive, Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Currency } from '../constants';

@ObjectType()
@Directive('@key(fields: "id")')
export class Order {
  @Field(() => ID)
  id: number;

  @Field()
  status: string;

  @Field(() => Currency)
  currency: Currency;

  @Field(() => [Product])
  details: Product[];
}

@ObjectType()
export class Product {
  @Field(() => ID)
  product_id: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}

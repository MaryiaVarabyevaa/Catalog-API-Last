import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import {Currency} from "../../order/constants";

@ObjectType()
export class CartEntity {
  @Field(() => ID)
  id: number;

  @Field(() => Currency)
  currency: Currency;

  @Field(() => [Product])
  details: Product[];
}

@ObjectType()
export class Product {
  @Field(() => ID)
  id: number;

  @Field()
  product_id: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}

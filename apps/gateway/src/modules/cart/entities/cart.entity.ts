import { Directive, Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Currency } from '../../order/constants';

@ObjectType()
@Directive('@key(fields: "id")')
export class CartEntity {
  @Field(() => ID)
  id: number;

  @Field(() => Currency)
  currency: Currency;

  @Field(() => [ProductInCart])
  details: ProductInCart[];
}

@ObjectType()
export class ProductInCart {
  @Field(() => ID)
  id: number;

  @Field()
  product_id: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}

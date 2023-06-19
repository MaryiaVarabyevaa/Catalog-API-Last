import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CartEntity {
  @Field(() => ID)
  id: number;

  @Field()
  currency: string;

  @Field(() => [Product])
  products: Product[];
}

@ObjectType()
export class Product {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;
}

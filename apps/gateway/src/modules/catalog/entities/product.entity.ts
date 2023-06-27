import { Directive, Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { Currency } from '../../order/constants';

@ObjectType()
@Directive('@key(fields: "id")')
export class ProductEntity {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field(() => Currency)
  currency: Currency;

  @Field()
  img_url: string;

  @Field(() => Int)
  totalQuantity: number;

  @Field(() => Int)
  availableQuantity: number;
}

import { Field, InputType, ID, Float, Int } from '@nestjs/graphql';
import { Currency } from '../../constants';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

// @InputType()
// export class CreateOrderInput {
//   @Field(() => [ProductInput])
//   products: ProductInput[];
//
//   @Field(() => Currency)
//   currency: Currency;
// }
//
// @InputType()
// export class ProductInput {
//   @Field(() => ID)
//   productId: number;
//
//   @Field(() => Float)
//   quantity: number;
//
//   @Field(() => Float)
//   price: number;
// }

@InputType()
export class CreateOrderInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cartId: number;
}

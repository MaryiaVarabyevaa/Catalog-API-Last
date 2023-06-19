import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

@InputType()
export class AddProductInput {
  @Field(() => Int)
  productId: number;

  @Field(() => String)
  currency: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;
}

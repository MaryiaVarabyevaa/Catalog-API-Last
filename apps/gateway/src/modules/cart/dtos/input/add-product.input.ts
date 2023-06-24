import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsPositive} from 'class-validator';
import {Currency} from "../../../order/constants";

@InputType()
export class AddProductInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  productId: number;

  @Field(() => Currency)
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  newCart?: boolean;

}

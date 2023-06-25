import { Field, Float, ID, InputType } from '@nestjs/graphql';
import {IsEnum, IsNotEmpty, IsNumber, IsPositive} from "class-validator";
import {Type} from "class-transformer";
import { Currency } from '../../constants';

@InputType()
export class UpdateOrderInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  id: number;

  @Field(() => Currency)
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @Field(() => [ProductUpdateInput])
  @Type(() => ProductUpdateInput)
  products: ProductUpdateInput[];
}

@InputType()
export class ProductUpdateInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  productId: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;
}

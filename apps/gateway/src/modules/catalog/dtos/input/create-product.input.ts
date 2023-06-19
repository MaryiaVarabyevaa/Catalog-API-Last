import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import { Currency } from '../../../order/constants';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field(() => Float)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @Field(() => Currency)
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;

  @Field(() => String)
  @IsNotEmpty()
  @IsUrl()
  img_url: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  totalQuantity: number;
}

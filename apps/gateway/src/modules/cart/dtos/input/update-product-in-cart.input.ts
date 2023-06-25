import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { AddProductInput } from './add-product.input';

@InputType()
export class UpdateProductInCartInput extends AddProductInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  id: number;
}

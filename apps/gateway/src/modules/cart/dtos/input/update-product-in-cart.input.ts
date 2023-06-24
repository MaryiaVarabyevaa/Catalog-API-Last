import { AddProductInput } from './add-product.input';
import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateProductInCartInput extends AddProductInput {
  @Field(() => ID)
  id: number;
}

import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class DeleteOrderInput {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  cartId: number;
}

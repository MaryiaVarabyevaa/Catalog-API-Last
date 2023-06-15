import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class GetOrderIdInput {
  @Field(() => ID)
  id: number;

  paymentMethodId: string;
}

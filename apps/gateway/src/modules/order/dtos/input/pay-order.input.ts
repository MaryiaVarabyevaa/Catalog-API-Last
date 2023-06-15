import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class PayOrderInput {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  paymentMethodId: string;
}

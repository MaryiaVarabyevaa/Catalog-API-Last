import { Field, ID, InputType } from '@nestjs/graphql';
import {IsNotEmpty, IsNumber, IsPositive, IsString} from "class-validator";

@InputType()
export class PayOrderInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  id: number;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;
}

import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

@InputType()
export class DeleteOrderInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  id: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cartId: number;
}

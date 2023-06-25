import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

@InputType()
export class ClearCartInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cartId: number;
}

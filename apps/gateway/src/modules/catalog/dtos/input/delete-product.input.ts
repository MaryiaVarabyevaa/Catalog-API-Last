import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class DeleteProductInput {
  @Field(() => ID)
  @IsNotEmpty()
  @IsNumber()
  id: number;
}

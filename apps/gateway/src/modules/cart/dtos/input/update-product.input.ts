import { AddProductInput } from './add-product.input';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput extends AddProductInput {}

import { CreateUserInput, LoginUserInput } from '../../dtos';
import { IdObjectWithRtType } from './id-object-with-rt.type';

export type DataType =
  | CreateUserInput
  | LoginUserInput
  | IdObject
  | IdObjectWithRtType;

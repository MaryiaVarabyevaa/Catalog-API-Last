import { Currency } from '../constants';

export interface Order {
  id: string;
  amount: number;
  currency: Currency;
  description: string;
  status: string;
}

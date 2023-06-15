import { Currency } from './currency.type';

export interface Order {
  id: string;
  amount: number;
  currency: Currency;
  description: string;
  status: string;
}

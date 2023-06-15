import { registerEnumType } from '@nestjs/graphql';

export enum Currency {
  BYN = 'BYN',
  RUB = 'RUB',
  USD = 'USD',
  EUR = 'EUR',
  CNY = 'CHY',
}

registerEnumType(Currency, {
  name: 'Currency',
});

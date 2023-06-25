import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { Currency } from '../order/constants';
import { Order } from '../order/types';

@Injectable()
export class StripeService {
  private stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
  }

  async createOrder(order: Partial<Order>): Promise<Order> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.amount * 100),
      currency: order.currency,
      description: order.description,
    });

    return this.paymentIntentToOrder(paymentIntent);
  }

  // async updateOrder(orderId: string, order: Partial<Order>): Promise<Order> {
  //   const paymentIntent = await this.stripe.paymentIntents.update(orderId, {
  //     amount: Math.round(order.amount * 100),
  //     currency: order.currency,
  //     description: order.description,
  //   });
  //
  //   return this.paymentIntentToOrder(paymentIntent);
  // }

  async deleteOrder(orderId: string): Promise<void> {
    await this.stripe.paymentIntents.cancel(orderId);
  }

  async getOrder(orderId: string): Promise<Order> {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(orderId);

    return this.paymentIntentToOrder(paymentIntent);
  }

  async payOrder(orderId: string, paymentMethodId: string): Promise<Order> {
    try {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: '4242424242424242',
          // number: '4000000000009995',
          exp_month: 12,
          exp_year: 2024,
          cvc: '123',
        },
      });

      const paymentIntent = await this.stripe.paymentIntents.confirm(orderId, {
        payment_method: paymentMethod.id,
        // payment_method: paymentMethodId
      });

      return this.paymentIntentToOrder(paymentIntent);
    } catch (err) {
      return null;
    }
  }

  private paymentIntentToOrder(paymentIntent: Stripe.PaymentIntent): Order {
    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency as Currency,
      description: paymentIntent.description,
      status: paymentIntent.status.toUpperCase(),
    };
  }
}

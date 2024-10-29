import Stripe from 'stripe';
import config from '../../../config';
import { IPayment } from './payment.interface';
import { Payment } from './payment.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

export const stripe = new Stripe(config.payment.stripe_secret_key as string, {
  apiVersion: '2024-09-30.acacia',
});

const makePaymentIntent = async (payload: IPayment) => {
  const { user, amount } = payload; // Destructure user and amount
  const amountInCents = Math.trunc(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  const createPayment = await Payment.create({ ...payload, user }); // Include user in payment record

  if (!createPayment) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Payment failed');
  }

  return {
    client_secret: paymentIntent.client_secret,
    transactionId: paymentIntent.id,
  };
};

// const makePaymentIntent = async (payload: IPayment) => {
//   try {
//     const { user, amount } = payload;
//     const amountInCents = Math.trunc(amount * 100);

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amountInCents,
//       currency: 'usd',
//       payment_method_types: ['card'],
//     });

//     return {
//       client_secret: paymentIntent.client_secret,
//       transactionId: paymentIntent.id,
//     };
//   } catch (error) {
//     console.error('Payment intent creation error:', error);
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Payment failed');
//   }
// };

export const PaymentService = {
  makePaymentIntent,
};

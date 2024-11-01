import Stripe from 'stripe';
import config from '../../../config';
import { IPayment } from './payment.interface';
import { Payment } from './payment.model';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import { Types } from 'mongoose';
import { sendNotifications } from '../../../helpers/notificationHelper';
import { User } from '../user/user.model';

export const stripe = new Stripe(config.payment.stripe_secret_key as string, {
  apiVersion: '2024-09-30.acacia',
});

const makePaymentIntent = async (payload: IPayment) => {
  const { user, amount } = payload;
  const amountInCents = Math.trunc(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    payment_method_types: ['card'],
  });

  const values = {
    ...payload,
    transactionId: paymentIntent.id,
  };

  // Create the payment document directly from `values`
  const createPayment = await Payment.create(values);

  if (!createPayment) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Payment failed');
  }

  const isUser = await User.findById(user);

  if (paymentIntent) {
    const data = {
      text: `You have received $${amount} from ${isUser?.name} `,
      receiver: payload.user,
      type: 'ADMIN',
    };

    await sendNotifications(data);
  }

  return {
    client_secret: paymentIntent.client_secret,
    transactionId: paymentIntent.id,
  };
};

const getAllPayments = async (query: Record<string, unknown>) => {
  const paymentBilder = new QueryBuilder(
    Payment.find()
      .populate({
        path: 'user',
        select: 'name email',
      })
      .populate({
        path: 'product',
        select: 'name image amount',
        populate: {
          path: 'category',
          select: 'name',
        },
      }),

    query
  )
    // .search(brandSearchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await paymentBilder.modelQuery;
  return result;
};

const getAllUserPayments = async (userId: Types.ObjectId) => {
  const payments = await Payment.find({ user: userId }).populate([
    'user',
    'product',
  ]);

  return payments;
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

//     console.log(paymentIntent.status);

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
  getAllPayments,
  getAllUserPayments,
};

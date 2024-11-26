import { model, Schema } from 'mongoose';
import { IPayment } from './payment.interface';
import { string } from 'zod';

const paymentSchema = new Schema<IPayment>(
  {
    amount: {
      type: Number,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      // Update to use the new structure
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    // quantity: {
    //   type: Number,
    //   required: true,
    // },
    email: {
      type: String,
      required: true,
    },
    code: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'delete'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export const Payment = model<IPayment>('Payment', paymentSchema);

import { Types } from 'mongoose';

export type IPayment = {
  amount: number;
  user: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
  transactionId: string;
  email: string;
  status: 'active' | 'delete';
};

import { Types } from 'mongoose';

export type IPayment = {
  amount: number;
  user: Types.ObjectId;
  email: string;
  status: 'active' | 'delete';
};

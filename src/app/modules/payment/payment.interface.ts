import { Types } from 'mongoose';

export type IProductWithQuantity = {
  productId: Types.ObjectId; // Ensure this is an ObjectId type
  quantity: number;
};

export type IPayment = {
  amount: number;
  user: Types.ObjectId;
  products: IProductWithQuantity[];
  // product:  Types.ObjectId;
  // quantity: number;
  transactionId: string;
  email: string;
  code: string;
  status: 'active' | 'delete';
};

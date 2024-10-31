import { Types } from 'mongoose';

export type IWishlist = {
  user: Types.ObjectId;
  products: Types.ObjectId[];
};

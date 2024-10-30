import { Types } from 'mongoose';

export type IProduct = {
  name: string;
  image: string[];
  video: string;
  price: string;
  rating?: number;
  count?: string;
  category: Types.ObjectId;
  size: string;
  colors: string;
  gender: 'male' | 'female';
  status: 'active' | 'delete';
};

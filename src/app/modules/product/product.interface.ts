import { Model, Types } from 'mongoose';

export type IProduct = {
  name: string;
  image: string[];
  video: string;
  price: number;
  rating?: number;
  count?: string;
  category: Types.ObjectId;
  size: string;
  colors: string;
  gender: 'male' | 'female';
  status: 'active' | 'delete';
};

export type UpdateProductsPayload = Partial<IProduct> & {
  imagesToDelete?: string[];
};

export type ProductModel = Model<IProduct>;

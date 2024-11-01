import { model, Schema } from 'mongoose';
import { IProduct } from './product.interface';
import ApiError from '../../../errors/ApiError';
import { StatusCodes } from 'http-status-codes';

const productSchema = new Schema<IProduct>(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: [String],
    },
    video: {
      type: String,
    },
    price: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
    },
    count: {
      type: String,
    },
    size: {
      type: String,
      required: true,
    },
    colors: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
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

productSchema.pre('save', async function (next) {
  const isExist = await Product.findOne({ name: this.name });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Product already exist!');
  }
  next();
});

export const Product = model<IProduct>('Product', productSchema);

import mongoose from 'mongoose';
import { IClient } from './client.interface';

const ClientSchema = new mongoose.Schema<IClient>(
  {
    address: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'deleted'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export const Client = mongoose.model<IClient>('Client', ClientSchema);

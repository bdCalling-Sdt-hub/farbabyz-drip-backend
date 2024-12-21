import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type IUser = {
  role: USER_ROLES;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  password: string;
  status: 'active' | 'suspended' | 'deleted';
  verified: boolean;
  phone: string;
  image: string;
  startTime: string;
  endTime: string;
  client?: Types.ObjectId;
  driver?: Types.ObjectId;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isAccountCreated(id: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;

import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export type IUser = {
  role: USER_ROLES;
  name: string;
  email: string;
  phone: string;
  password: string;
  postCode: string;
  address?: string;
  status: 'active' | 'delete';
  verified: boolean;
  image: string;
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
  accountInformation?: {
    status: boolean;
    stripeAccountId: string;
    externalAccountId: string;
    currency: string;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isAccountCreated(id: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;

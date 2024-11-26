import express, { NextFunction, Request, Response } from 'express';
import { PaymentController } from './payment.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-payment',
  auth(USER_ROLES.USER),
  PaymentController.makePaymentIntent
);

router.get('/', auth(USER_ROLES.ADMIN), PaymentController.getAllPayment);

router.get(
  '/getUser',
  auth(USER_ROLES.USER),
  PaymentController.getAllUserPayment
);

export const PaymentRoutes = router;

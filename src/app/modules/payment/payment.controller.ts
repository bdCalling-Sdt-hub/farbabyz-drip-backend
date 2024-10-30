import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PaymentService } from './payment.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const makePaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const users = req.user;

  const value = {
    ...req.body,
    user: users.id,
    email: users.email,
  };

  const data = await PaymentService.makePaymentIntent(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Payment intent created successfully',
    data: data,
  });
});

const getAllPayment = catchAsync(async (req: Request, res: Response) => {
  const data = await PaymentService.getAllPayments(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Payment intent retrived successfully',
    data: data,
  });
});

const getAllUserPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const payments = await PaymentService.getAllUserPayments(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User payment list retrieved successfully',
    data: payments,
  });
});

export const PaymentController = {
  makePaymentIntent,
  getAllPayment,
  getAllUserPayment,
};

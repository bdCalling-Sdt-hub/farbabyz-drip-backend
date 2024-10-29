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

export const PaymentController = {
  makePaymentIntent,
};

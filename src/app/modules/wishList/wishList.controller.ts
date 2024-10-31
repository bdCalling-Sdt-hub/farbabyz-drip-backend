import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { WishListService } from './wishList.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createWishListToDB = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { products } = req.body;

  const result = await WishListService.createWishListToDB(userId, products);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'WishList created successfully',
    data: result,
  });
});

const removeWishListToDB = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { productId } = req.body;

  const result = await WishListService.removeWishListToDB(userId, productId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'WishList removed successfully',
    data: result,
  });
});

const getAllWishListToDB = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await WishListService.getAllWishListToDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'WishList retrived successfully',
    data: result,
  });
});

export const WishListController = {
  createWishListToDB,
  removeWishListToDB,
  getAllWishListToDB,
};

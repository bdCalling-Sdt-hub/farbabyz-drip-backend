import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import getFilePath from '../../../shared/getFilePath';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let image = getFilePath(req.files, 'images');
    const value = {
      image,
      ...req.body,
    };

    await UserService.createUserFromDb(value);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message:
        'Please check your email to verify your account. We have sent you an OTP to complete the registration process.',
    });
  }
);

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

//update profile
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let image = getFilePath(req.files, 'images');
    const value = {
      image,
      ...req.body,
    };

    const result = await UserService.updateProfileToDB(user, value);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User retrived successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  getUserProfile,
  updateProfile,
  getAllUser,
};

import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import getFilePath from '../../../shared/getFilePath';
import { BlogService } from './blog.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createBlogIntoDb = catchAsync(async (req: Request, res: Response) => {
  let image = getFilePath(req.files, 'images');
  const value = {
    image,
    ...req.body,
  };

  const result = await BlogService.createBlogsToDB(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Blog published successfully',
    data: result,
  });
});

export const BlogController = {
  createBlogIntoDb,
};

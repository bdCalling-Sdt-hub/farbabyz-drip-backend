import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import getFilePath, { getFilePathMultiple } from '../../../shared/getFilePath';
import { ProductService } from './product.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { getVideoFilePath } from '../../../shared/videoUploder';

const createProductIntoDb = catchAsync(async (req: Request, res: Response) => {
  //   let image = getFilePath(req.files, 'image');

  const value = {
    ...req.body,
  };

  let video = getFilePathMultiple(req.files, 'media', 'media');
  let image = getFilePathMultiple(req.files, 'image', 'image');

  if (image && image.length > 0) {
    // value.image = image[0];
    value.image = image;
  }

  if (video && video.length > 0) {
    value.video = video[0];
  }

  const result = await ProductService.createProductIntoDb(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product created successfully',
    data: result,
  });
});

export const ProductController = {
  createProductIntoDb,
};

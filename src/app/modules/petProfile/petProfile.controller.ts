import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PetProfileService } from './petProfile.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import getFilePath from '../../../shared/getFilePath';

const createPetProfileIntoDb = catchAsync(
  async (req: Request, res: Response) => {
    let image = getFilePath(req.files, 'images');
    const value = {
      image,
      ...req.body,
    };

    const result = await PetProfileService.createPetProfileIntoDb(value);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Pet profile created successfully',
      data: result,
    });
  }
);

const updatePetProfileIntoDb = catchAsync(
  async (req: Request, res: Response) => {
    let image = getFilePath(req.files, 'images');
    const petId = req.params.id;
    const value = {
      image,
      ...req.body,
    };

    const result = await PetProfileService.updatePetProfile(petId, value);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Pet profile updated successfully',
      data: result,
    });
  }
);

const getAllPetProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await PetProfileService.getAllPetProfile();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Pet profile retrieved successfully',
    data: result,
  });
});

export const PetProfileController = {
  createPetProfileIntoDb,
  getAllPetProfile,
  updatePetProfileIntoDb,
};

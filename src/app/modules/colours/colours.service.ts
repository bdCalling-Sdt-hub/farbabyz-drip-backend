import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IColours } from './colours.interface';
import { Colour } from './colours.model';

const createColourToDB = async (payload: IColours) => {
  const result = await Colour.create(payload);
  return result;
};

const getAllColours = async () => {
  const result = await Colour.find().sort({ createdAt: -1 });
  return result;
};

const getSingleColour = async (id: string) => {
  const result = await Colour.findById(id);
  return result;
};

const updateColour = async (id: string, payload: Partial<IColours>) => {
  // const isExist = await Colour.findOne({ colourName: payload.colourName });
  // if (isExist) {
  //   throw new ApiError(StatusCodes.BAD_REQUEST, 'Colour already exist!');
  // }

  const result = await Colour.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteColour = async (id: string) => {
  const result = await Colour.findByIdAndDelete(id);
  return result;
};

export const ColourService = {
  createColourToDB,
  getAllColours,
  getSingleColour,
  updateColour,
  deleteColour,
};

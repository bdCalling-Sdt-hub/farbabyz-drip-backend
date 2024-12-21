import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder, startSession } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import unlinkFile from '../../../shared/unlinkFile';
import { IClient } from '../client/client.interface';
import { Client } from '../client/client.model';
import { Category } from '../category/category.model';

const createClientToDB = async (payload: Partial<IUser & IClient>) => {
  const session = await startSession();

  try {
    session.startTransaction();

    // Set role
    payload.role = USER_ROLES.CLIENT;

    const isEmail = await User.findOne({ email: payload.email });
    if (isEmail) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exist');
    }

    // Validate required fields
    if (!payload.email) {
      {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Please provide email');
      }
    }

    // Create brand
    const [client] = await Client.create([payload], {
      session,
    });

    if (!client) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Failed to create Influencer'
      );
    }

    payload.client = client._id;

    // Create user
    const [user] = await User.create([payload], { session });
    if (!user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
    }

    // Generate OTP and prepare email
    const otp = generateOTP();
    const emailValues = {
      name: user.firstName,
      email: user.email,
      otp: otp,
    };
    const accountEmailTemplate = emailTemplate.createAccount(emailValues);
    emailHelper.sendEmail(accountEmailTemplate);

    // Update user with authentication details
    const authentication = {
      oneTimeCode: otp,
      expireAt: new Date(Date.now() + 3 * 60000),
    };
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { authentication } },
      { session, new: true }
    );

    if (!updatedUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found for update');
    }

    // Commit transaction
    await session.commitTransaction();

    return updatedUser;
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    throw error;
  } finally {
    // Ensure session ends regardless of success or failure
    await session.endSession();
  }
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const { searchTerm, name, page, limit, ...filterData } = query;
  const anyConditions: any[] = [{ status: 'active' }];

  // Filter by searchTerm in categories if provided
  if (searchTerm) {
    const categoriesIds = await Client.find({
      $or: [{ firstName: { $regex: searchTerm, $options: 'i' } }],
    }).distinct('_id');
    if (categoriesIds.length > 0) {
      anyConditions.push({ client: { $in: categoriesIds } });
    }
  }

  if (name) {
    anyConditions.push({
      $or: [{ name: { $regex: name, $options: 'i' } }],
    });
  }

  // Filter by additional filterData fields
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    anyConditions.push({ $and: filterConditions });
  }

  // Combine all conditions
  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Fetch campaigns
  const result = await User.find(whereConditions)
    .populate('client')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await User.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};
const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.findById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);

  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (!isExistUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Blog not found');
  }

  if (payload.image && isExistUser.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

export const UserService = {
  getUserProfileFromDB,
  updateProfileToDB,
  getAllUsers,
  getSingleUser,
  createClientToDB,
};

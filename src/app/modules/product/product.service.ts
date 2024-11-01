import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Category } from '../category/category.model';
import { Payment } from '../payment/payment.model';
import { User } from '../user/user.model';
import { IProduct } from './product.interface';
import { Product } from './product.model';
import { SortOrder } from 'mongoose';

const createProductIntoDb = async (payload: Partial<IProduct>) => {
  if (!payload.image || !payload.video) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `Image or Video are required`);
  }

  const result = await Product.create(payload);
  return result;
};

const getAllProducts = async (query: Record<string, unknown>) => {
  const {
    searchTerm,
    page,
    limit,
    sortBy = 'createdAt',
    order = 'desc',
    ...filterData
  } = query;
  const anyConditions: any[] = [];

  if (searchTerm) {
    const categoriesIds = await Category.find({
      $or: [{ name: { $regex: searchTerm, $options: 'i' } }],
    }).distinct('_id');

    // Only add `category` condition if there are matching categories
    if (categoriesIds.length > 0) {
      anyConditions.push({ category: { $in: categoriesIds } });
    }
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({
        [field]: value,
      })
    );
    anyConditions.push({ $and: filterConditions });
  }

  // Apply filter conditions
  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Set default sort order to show new data first
  const sortOrder: SortOrder = order === 'desc' ? -1 : 1;
  const sortCondition: { [key: string]: SortOrder } = {
    [sortBy as string]: sortOrder,
  };

  const result = await Product.find(whereConditions)
    .populate('category', 'name')
    .sort(sortCondition)
    .skip(skip)
    .limit(size)
    .lean();
  const count = await Product.countDocuments(whereConditions);

  const data: any = {
    result,
    meta: {
      page: pages,
      limit: size,
      total: count,
      totalPages: Math.ceil(count / size),
      currentPage: pages,
    },
  };
  return data;
};

const getSingleProduct = async (id: string) => {
  const result = await Product.findById(id).populate('category', 'name');
  return result;
};

const updateProduct = async (id: string, payload: Partial<IProduct>) => {
  const { image, ...remainingData } = payload;

  const modifiedUpdateData: Record<string, unknown> = {
    ...remainingData,
  };

  if (image && image.length > 0) {
    const currentInfluencer = await Product.findById(id);

    if (currentInfluencer) {
      const updatedImages = [...currentInfluencer.image];

      image.forEach((value, index) => {
        if (value) {
          updatedImages[index] = value;
        }
      });

      modifiedUpdateData.image = updatedImages;
    }
  }

  const result = await Product.findByIdAndUpdate(id, modifiedUpdateData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteProduct = async (id: string) => {
  const result = await Product.findByIdAndUpdate(id, { status: 'delete' });
  return result;
};

export const ProductService = {
  createProductIntoDb,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};

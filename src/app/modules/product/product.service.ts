import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Category } from '../category/category.model';
import { Payment } from '../payment/payment.model';
import { User } from '../user/user.model';
import { IProduct, UpdateProductsPayload } from './product.interface';
import { Product } from './product.model';
import { SortOrder, model } from 'mongoose';
import unlinkFile from '../../../shared/unlinkFile';
import { Colour } from '../colours/colours.model';
import { Size } from '../size/size.model';

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
    category,
    colors,
    gender,
    page,
    sizes,
    limit,
    sortBy,
    order,
    newProduct,
    bestSellingProduct,
    ...filterData
  } = query;
  const anyConditions: any[] = [];

  if (category) {
    const categoriesIds = await Category.find({
      $or: [{ name: { $regex: category, $options: 'i' } }],
    }).distinct('_id');

    // Only add `category` condition if there are matching categories
    if (categoriesIds.length > 0) {
      anyConditions.push({ category: { $in: categoriesIds } });
    }
  }

  if (colors) {
    const coloursIds = await Colour.find({
      $or: [{ colourName: { $regex: colors, $options: 'i' } }],
    }).distinct('_id');

    // Only add `category` condition if there are matching categories
    if (coloursIds.length > 0) {
      anyConditions.push({ colour: { $in: coloursIds } });
    }
  }

  if (sizes) {
    const sizeIds = await Size.find({
      $or: [{ sizeName: { $regex: sizes, $options: 'i' } }],
    }).distinct('_id');

    if (sizeIds.length > 0) {
      anyConditions.push({ size: { $in: sizeIds } });
    }
  }

  if (searchTerm) {
    anyConditions.push({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ],
    });
  }

  if (gender) {
    anyConditions.push({
      $or: [{ gender: { $regex: gender, $options: 'i' } }],
    });
  }

  if (bestSellingProduct) {
    const ratingValue = parseInt(bestSellingProduct as string, 10); // Ensure it's a number

    if (!isNaN(ratingValue)) {
      anyConditions.push({
        rating: ratingValue, // Filter by exact rating
      });
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

  if (newProduct === 'true') {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    anyConditions.push({ createdAt: { $gte: thirtyDaysAgo } });
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

  if (newProduct === 'true') {
    sortCondition.createdAt = -1;
  }

  const result = await Product.find(whereConditions)
    .populate('category', 'name')
    .populate('colour', 'colourName')
    .populate({
      path: 'size',
      select: 'sizeName',
    })
    .sort(sortCondition)
    .skip(skip)
    .limit(size);
  // .lean();
  // .exec();
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

const hello = async (query: Record<string, unknown>) => {
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
    anyConditions.push({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ],
    });
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

const bestSellingProducts = async () => {
  const result = await Product.find({ rating: { $gte: 4 } })
    .sort({ sold: -1 })
    .limit(10)
    .populate('category', 'name');
  return result;
};

const getSingleProduct = async (id: string) => {
  const result = await Product.findById(id)
    .populate('category', 'name')
    .populate('size', 'sizeName');
  return result;
};

const similarProducts = async (category: string) => {
  const result = await Product.find({ category: category })
    .populate('category', 'name')
    .populate('size', 'sizeName')
    .limit(10);

  console.log(result);

  return result;
};

const updateProduct = async (id: string, payload: UpdateProductsPayload) => {
  const isExistProducts = await Product.findById(id);

  // Check if the product exists
  if (!isExistProducts) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product doesn't exist!");
  }

  if (payload.imagesToDelete && payload.imagesToDelete.length > 0) {
    for (let image of payload.imagesToDelete) {
      unlinkFile(image); // Ensure unlinkFile handles errors gracefully
    }
    // Remove deleted images from the existing image array
    isExistProducts.image = isExistProducts.image.filter(
      (img: string) => !payload.imagesToDelete!.includes(img)
    );
  }

  const updatedImages = payload.image
    ? [...isExistProducts.image, ...payload.image]
    : isExistProducts.image;

  const updateData = {
    ...payload,
    image: updatedImages,
  };

  const result = await Product.findByIdAndUpdate(id, updateData, {
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
  bestSellingProducts,
  similarProducts,
};

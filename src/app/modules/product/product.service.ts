import QueryBuilder from '../../builder/QueryBuilder';
import { Category } from '../category/category.model';
import { productSearchAbleFields } from './product.constant';
import { IProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDb = async (payload: Partial<IProduct>) => {
  const result = await Product.create(payload);
  return result;
};

const getAllProducts = async (query: Record<string, unknown>) => {
  const { searchTerm, page, limit, ...filterData } = query;
  const anyConditions: any[] = [];

  if (searchTerm) {
    const categoriesIds = await Category.find({
      $or: [{ name: { $regex: searchTerm, $options: 'i' } }],
    }).distinct('_id');

    // Only add `catogory` condition if there are matching users
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

  const result = await Product.find(whereConditions)
    .populate('category', 'name')
    .skip(skip)
    .limit(size)
    .lean();
  const count = await Product.countDocuments(whereConditions);

  const data: any = {
    result,
    meta: {
      page: pages,
      total: count,
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

  //   if (image && image.length > 0) {
  //     for (const [index, value] of image.entries()) {
  //       modifiedUpdateData[`image.${index}`] = value;
  //     }
  //   }

  if (Array.isArray(image) && image.length) {
    image.forEach((value, index) => {
      modifiedUpdateData[`image.${index}`] = value;
    });
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

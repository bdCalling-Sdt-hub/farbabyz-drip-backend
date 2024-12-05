import { ICategory } from './category.interface';
import { Category } from './category.model';

const createCategoryToDB = async (payload: Partial<ICategory>) => {
  const result = await Category.create(payload);
  return result;
};

const getAllCategory = async () => {
  const result = await Category.find({ status: 'active' }).sort({
    createdAt: -1,
  });
  return result;
};

const getSingleCategory = async (id: string) => {
  const result = await Category.findById(id);
  return result;
};

const updateCategory = async (id: string, payload: Partial<ICategory>) => {
  const result = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteCategory = async (id: string) => {
  const result = await Category.findByIdAndUpdate(id, { status: 'delete' });
  return result;
};

export const CategoryService = {
  createCategoryToDB,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};

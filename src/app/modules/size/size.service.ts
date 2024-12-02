import { SortOrder } from 'mongoose';
import { ISize } from './size.interface';
import { Size } from './size.model';

const createColourToDB = async (payload: ISize) => {
  const result = await Size.create(payload);
  return result;
};

const getAllColours = async (query: Record<string, unknown>) => {
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

  const result = await Size.find(whereConditions)
    .sort(sortCondition)
    .skip(skip)
    .limit(size)
    .lean();
  const count = await Size.countDocuments(whereConditions);

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

const getSingleColour = async (id: string) => {
  const result = await Size.findById(id);
  return result;
};

const updateColour = async (id: string, payload: Partial<ISize>) => {
  const result = await Size.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteColour = async (id: string) => {
  const result = await Size.findByIdAndDelete(id);
  return result;
};

export const SizeService = {
  createColourToDB,
  getAllColours,
  getSingleColour,
  updateColour,
  deleteColour,
};

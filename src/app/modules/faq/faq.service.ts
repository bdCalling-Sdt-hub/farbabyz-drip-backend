import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';

import QueryBuilder from '../../builder/QueryBuilder';
import { IFaq } from './faq.interface';
import { Faq } from './faq.model';
import { faqSearchAbleFields } from './faq.constant';
import { SortOrder } from 'mongoose';

const createFaqToDB = async (payload: Partial<IFaq>) => {
  const result = await Faq.create(payload);
  return result;
};

const getAllFaq = async (query: Record<string, unknown>) => {
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

  const result = await Faq.find(whereConditions)
    .sort(sortCondition)
    .skip(skip)
    .limit(size);
  const count = await Faq.countDocuments(whereConditions);

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
const getSingleFaq = async (id: string) => {
  const result = await Faq.findById(id);
  return result;
};

const updateFaq = async (id: string, payload: Partial<IFaq>) => {
  const result = await Faq.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteFaq = async (id: string) => {
  const result = await Faq.findByIdAndDelete(id);
  return result;
};

export const FaqService = {
  createFaqToDB,
  getAllFaq,
  getSingleFaq,
  updateFaq,
  deleteFaq,
};

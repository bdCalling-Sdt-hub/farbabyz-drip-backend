import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';

import QueryBuilder from '../../builder/QueryBuilder';
import { IFaq } from './faq.interface';
import { Faq } from './faq.model';
import { faqSearchAbleFields } from './faq.constant';

const createFaqToDB = async (payload: Partial<IFaq>) => {
  const result = await Faq.create(payload);
  return result;
};

const getAllFaq = async (query: Record<string, unknown>) => {
  const faqBuilder = new QueryBuilder(Faq.find(), query)
    .search(faqSearchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await faqBuilder.modelQuery;

  return result;
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

import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBlogs } from './blog.interface';
import { Blog } from './blog.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { blogSearchAbleFields } from './faq.constant';
import { SortOrder } from 'mongoose';

const createBlogsToDB = async (payload: Partial<IBlogs>) => {
  const isExistBlog = await Blog.findOne({
    title: payload.title,
  });
  if (isExistBlog) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Blog already exist!');
  }

  const result = await Blog.create(payload);
  return result;
};

// const getAllBlogs = async (query: Record<string, unknown>) => {
//   const blogBuilder = new QueryBuilder(Blog.find(), query)
//     .search(blogSearchAbleFields)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await blogBuilder.modelQuery;
//   return result;
// };

const getAllBlogs = async (query: Record<string, unknown>) => {
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

  const result = await Blog.find(whereConditions)
    .sort(sortCondition)
    .skip(skip)
    .limit(size);
  const count = await Blog.countDocuments(whereConditions);

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

const getSingleblog = async (id: string) => {
  const result = await Blog.findById(id);
  return result;
};

const updateBlog = async (id: string, payload: Partial<IBlogs>) => {
  const result = await Blog.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteBlog = async (id: string) => {
  const result = await Blog.findByIdAndDelete(id);
  return result;
};

export const BlogService = {
  createBlogsToDB,
  getAllBlogs,
  getSingleblog,
  deleteBlog,
  updateBlog,
};

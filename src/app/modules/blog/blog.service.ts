import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBlogs } from './blog.interface';
import { Blog } from './blog.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { blogSearchAbleFields } from './faq.constant';

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

const getAllBlogs = async (query: Record<string, unknown>) => {
  const blogBuilder = new QueryBuilder(Blog.find(), query)
    .search(blogSearchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await blogBuilder.modelQuery;
  return result;
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

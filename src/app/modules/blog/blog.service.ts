import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBlogs } from './blog.interface';
import { Blog } from './blog.model';

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

export const BlogService = {
  createBlogsToDB,
};

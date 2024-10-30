import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  price: z.string({ required_error: 'Price is required' }),
  rating: z.number().optional(),
  category: z.string({ required_error: 'Category is required' }),
  size: z.string({ required_error: 'Size is required' }),
  colors: z.string({ required_error: 'Colors is required' }),
  gender: z.enum(['male', 'female']),
});

const updateProductSchema = z.object({
  name: z.string().optional(),
  price: z.string().optional(),
  rating: z.number().optional(),
  category: z.string().optional(),
  size: z.string().optional(),
  colors: z.string().optional(),
  gender: z.enum(['male', 'female']),
});

export const ProductValidation = {
  createProductSchema,
  updateProductSchema,
};

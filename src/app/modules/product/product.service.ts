import { IProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDb = async (payload: Partial<IProduct>) => {
  const result = await Product.create(payload);
  return result;
};

const getAllProducts = async () => {
  const result = await Product.find();
  return result;
};

const getSingleProduct = async (id: string) => {
  const result = await Product.findById(id);
  return result;
};
export const ProductService = {
  createProductIntoDb,
  getAllProducts,
  getSingleProduct,
};

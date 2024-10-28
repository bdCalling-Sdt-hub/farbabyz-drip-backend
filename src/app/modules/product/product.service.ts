import { IProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDb = async (payload: Partial<IProduct>) => {
  const result = await Product.create(payload);
  return result;
};

const getAllProducts = async () => {
  const result = await Product.find().populate('category');
  return result;
};

const getSingleProduct = async (id: string) => {
  const result = await Product.findById(id).populate('category');
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

export const ProductService = {
  createProductIntoDb,
  getAllProducts,
  getSingleProduct,
  updateProduct,
};

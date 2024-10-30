import QueryBuilder from '../../builder/QueryBuilder';
import { productSearchAbleFields } from './product.constant';
import { IProduct } from './product.interface';
import { Product } from './product.model';

const createProductIntoDb = async (payload: Partial<IProduct>) => {
  const result = await Product.create(payload);
  return result;
};

const getAllProducts = async (
  filter: Record<string, unknown>,
  query: Record<string, unknown>
) => {
  const productBuilder = new QueryBuilder(
    Product.find(filter).populate('category'),
    query
  )
    .search(productSearchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await productBuilder.modelQuery;
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

const deleteProduct = async (id: string) => {
  const result = await Product.findByIdAndUpdate(id, { status: 'delete' });
  return result;
};

export const ProductService = {
  createProductIntoDb,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};

import { Types } from 'mongoose';
import { Wishlist } from './wishList.model';
import { User } from '../user/user.model';

const createWishListToDB = async (
  userId: Types.ObjectId,
  productIds: Types.ObjectId[] = []
) => {
  let wishlist: any = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = new Wishlist({ user: userId, products: productIds });
  } else {
    const newProducts = productIds
      .filter(productId => !wishlist.products.includes(productId))
      .map(productId => new Types.ObjectId(productId));

    wishlist.products.push(...newProducts);
    wishlist.markModified('products');
  }

  return wishlist.save();
};

const removeWishListToDB = async (
  userId: Types.ObjectId,
  productId: Types.ObjectId
) => {
  const wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    return null;
  }

  wishlist.products = wishlist.products.filter(id => !id.equals(productId));

  return wishlist.save();
};

const getAllWishListToDB = async (userId: Types.ObjectId) => {
  const wishlist = await Wishlist.findOne({ user: userId }).populate(
    'products'
  );

  return wishlist;
};

export const WishListService = {
  createWishListToDB,
  removeWishListToDB,
  getAllWishListToDB,
};

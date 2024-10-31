import express from 'express';
import { WishListController } from './wishList.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/add',
  auth(USER_ROLES.USER),
  WishListController.createWishListToDB
);
router.post(
  '/remove',
  auth(USER_ROLES.USER),
  WishListController.removeWishListToDB
);

router.get('/', auth(USER_ROLES.USER), WishListController.getAllWishListToDB);

export const WishlistRoutes = router;

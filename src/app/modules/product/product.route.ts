import express, { NextFunction, Request, Response } from 'express';

import fileUploadHandler from '../../middlewares/fileUploadHandler';

import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { ProductValidation } from './product.validation';
import { ProductController } from './product.controller';

const router = express.Router();

router.post(
  '/create-product',
  fileUploadHandler(),
  // auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = ProductValidation.createProductSchema.parse(
      JSON.parse(req.body.data)
    );
    return ProductController.createProductIntoDb(req, res, next);
  }
);

// router.get(
//   '/',

//   BlogController.getAllBlogs
// );
// router.get('/:id', BlogController.getSingleblog);

// router.patch(
//   '/:id',
//   fileUploadHandler(),
//   //   auth(USER_ROLES.USER),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = BlogsValidation.createBlogsSchema.parse(
//       JSON.parse(req.body.data)
//     );
//     return BlogController.updateBlog(req, res, next);
//   }
// );

// router.delete(
//   '/:id',
//   //   auth(USER_ROLES.USER),
//   BlogController.deleteBlog
// );

export const ProductRoutes = router;

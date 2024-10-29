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

router.get('/', ProductController.getAllProducts);

router.get('/:id', ProductController.getSingleProduct);

router.patch(
  '/:id',
  fileUploadHandler(),
  //   auth(USER_ROLES.USER),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = ProductValidation.updateProductSchema.parse(
      JSON.parse(req.body.data)
    );
    return ProductController.updatedProductIntoDb(req, res, next);
  }
);

router.delete(
  '/:id',
  //   auth(USER_ROLES.USER),
  ProductController.deleteProduct
);

export const ProductRoutes = router;

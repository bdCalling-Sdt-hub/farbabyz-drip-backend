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
  auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = ProductValidation.createProductSchema.parse(
      JSON.parse(req.body.data)
    );
    return ProductController.createProductIntoDb(req, res, next);
  }
);

router.get(
  '/',
  // auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  ProductController.getAllProducts
);

router.get(
  '/get-best-selling',
  // auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  ProductController.bestSellingProducts
);

router.get(
  '/:id',
  auth(USER_ROLES.USER, USER_ROLES.ADMIN),
  ProductController.getSingleProduct
);

// router.patch(
//   '/:id',
//   fileUploadHandler(),
//   auth(USER_ROLES.ADMIN),
//   (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // Check if a file is uploaded and parse the data from the request body
//       const parsedData = JSON.parse(req.body.data || '{}');
//       req.body = ProductValidation.updateProductSchema.parse(parsedData);

//       // If a file is uploaded, include its reference in the update payload
//       if (req.file) {
//         req.body.image = req.file.path; // Assuming `fileUploadHandler` stores the file path in `req.file.path`
//       }

//       return ProductController.updatedProductIntoDb(req, res, next);
//     } catch (error) {
//       next(error); // Forward the error to the error handling middleware
//     }
//   }
// );

router.patch(
  '/:id',
  auth(USER_ROLES.ADMIN),
  fileUploadHandler(),
  (req: Request, res: Response, next: NextFunction) => {
    const { imagesToDelete, data } = req.body;

    if (!data && imagesToDelete) {
      req.body = { imagesToDelete };
      return ProductController.updatedProductIntoDb(req, res, next);
    }

    if (data) {
      const parsedData = ProductValidation.updateProductSchema.parse(
        JSON.parse(data)
      );

      req.body = { ...parsedData, imagesToDelete };
    }

    return ProductController.updatedProductIntoDb(req, res, next);
  }
);

router.delete('/:id', auth(USER_ROLES.ADMIN), ProductController.deleteProduct);

export const ProductRoutes = router;

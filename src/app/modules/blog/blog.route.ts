import express, { NextFunction, Request, Response } from 'express';

import fileUploadHandler from '../../middlewares/fileUploadHandler';

import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { BlogsValidation } from './blog.validation';
import { BlogController } from './blog.controller';

const router = express.Router();

router.post(
  '/create-blog',
  fileUploadHandler(),
  // auth(USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = BlogsValidation.createBlogsSchema.parse(
      JSON.parse(req.body.data)
    );
    return BlogController.createBlogIntoDb(req, res, next);
  }
);

// router.get(
//   '/',
//   //   auth(USER_ROLES.USER),
//   PetProfileController.getAllPetProfile
// );

// router.patch(
//   '/:id',
//   fileUploadHandler(),
//   //   auth(USER_ROLES.USER),
//   (req: Request, res: Response, next: NextFunction) => {
//     req.body = PetProfileValidation.updatePetProfileSchema.parse(
//       JSON.parse(req.body.data)
//     );
//     return PetProfileController.updatePetProfileIntoDb(req, res, next);
//   }
// );

export const BlogRoutes = router;

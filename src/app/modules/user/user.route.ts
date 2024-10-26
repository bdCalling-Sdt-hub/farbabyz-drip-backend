import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
const router = express.Router();

router.post(
  '/create-user',
  fileUploadHandler(),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.createUserZodSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createUser(req, res, next);
  }
);

router.patch(
  '/:id',
  fileUploadHandler(),
  auth(USER_ROLES.USER),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = UserValidation.updateZodSchema.parse(JSON.parse(req.body.data));
    return UserController.updateProfile(req, res, next);
  }
);

router.get(
  '/profile',
  auth(USER_ROLES.ADMIN, USER_ROLES.USER),
  UserController.getUserProfile
);

export const UserRoutes = router;

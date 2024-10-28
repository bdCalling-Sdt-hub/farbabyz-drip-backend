import express, { NextFunction, Request, Response } from 'express';

import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { PetProfileValidation } from './petProfile.validation';
import { PetProfileController } from './petProfile.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-profile',
  fileUploadHandler(),
  //   auth(USER_ROLES.USER),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = PetProfileValidation.createPetProfileSchema.parse(
      JSON.parse(req.body.data)
    );
    return PetProfileController.createPetProfileIntoDb(req, res, next);
  }
);

router.get(
  '/',
  //   auth(USER_ROLES.USER),
  PetProfileController.getAllPetProfile
);

router.patch(
  '/:id',
  fileUploadHandler(),
  //   auth(USER_ROLES.USER),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = PetProfileValidation.updatePetProfileSchema.parse(
      JSON.parse(req.body.data)
    );
    return PetProfileController.updatePetProfileIntoDb(req, res, next);
  }
);

export const PetProfileRoutes = router;

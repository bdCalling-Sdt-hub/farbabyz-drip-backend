import express, { NextFunction, Request, Response } from 'express';

import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { PetProfileValidation } from './petProfile.validation';
import { PetProfileController } from './petProfile.controller';

const router = express.Router();

router.post(
  '/create-profile',
  fileUploadHandler(),

  (req: Request, res: Response, next: NextFunction) => {
    req.body = PetProfileValidation.createPetProfileSchema.parse(
      JSON.parse(req.body.data)
    );
    return PetProfileController.createPetProfileIntoDb(req, res, next);
  }
);

export const PetProfileRoutes = router;

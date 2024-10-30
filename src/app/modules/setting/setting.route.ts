import express from 'express';
import { SettingController } from './setting.controller';

const router = express.Router();

router.post(
  '/create-terms',
  //   auth(USER_ROLES.ADMIN),
  SettingController.createTermsAndCondition
);

router.post(
  '/create-return-policy',
  //   auth(USER_ROLES.ADMIN),
  SettingController.createReturnPolicy
);

export const SettingRoutes = router;

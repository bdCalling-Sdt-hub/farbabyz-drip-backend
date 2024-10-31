import express from 'express';
import { SettingController } from './setting.controller';

const router = express.Router();

router.post(
  '/create-terms',
  //   auth(USER_ROLES.ADMIN),
  SettingController.createTermsAndCondition
);
router.get(
  '/get-terms',
  //   auth(USER_ROLES.ADMIN),
  SettingController.getTermsAndCondition
);

router.post(
  '/create-return-policy',
  //   auth(USER_ROLES.ADMIN),
  SettingController.createReturnPolicy
);

router.get(
  '/get-return-policy',
  //   auth(USER_ROLES.ADMIN),
  SettingController.getReturnPolicy
);

export const SettingRoutes = router;

import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewValidation } from './review.validation';
import { ReviewController } from './review.controller';

const router = express.Router();

router.post(
  '/create-review',
  validateRequest(ReviewValidation.createReviewSchema),
  ReviewController.createReviewToDB
);

export const ReviewRoutes = router;

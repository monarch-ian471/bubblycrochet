import express from 'express';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview
} from '../controllers/reviewController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.get('/product/:productId', getProductReviews);

router.route('/')
  .post(protect, createReview);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;

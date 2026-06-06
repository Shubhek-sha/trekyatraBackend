import express from 'express';
import {
  createReview,
  getReviewsByTrekId,
  getReviewById,
  updateReview,
  deleteReview,
} from '../controllers/review.controller.js';

const router = express.Router();

router.post('/', createReview);
router.get('/trek/:trekId', getReviewsByTrekId);
router.get('/:id', getReviewById);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;

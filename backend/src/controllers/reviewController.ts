import { Request, Response } from 'express';
import { Review } from '../models/Review';
import { AuthRequest } from '../middleware/auth';

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name avatar');
    
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const reviewData = {
      ...req.body,
      userId: req.user!._id,
      userName: req.user!.name
    };

    const review = await Review.create(reviewData);
    res.status(201).json({ success: true, review });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, review: updatedReview });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.userId.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

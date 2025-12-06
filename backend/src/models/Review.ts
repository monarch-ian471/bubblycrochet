import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      required: [true, 'Comment is required'],
      maxlength: [500, 'Comment cannot exceed 500 characters']
    }
  },
  {
    timestamps: true
  }
);

// Indexes
ReviewSchema.index({ productId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1 });

// Ensure one review per user per product
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);

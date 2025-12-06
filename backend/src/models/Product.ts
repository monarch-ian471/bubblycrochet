import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  inStock: boolean;
  discount?: number;
  daysToMake: number;
  shippingCost: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Blankets', 'Toys', 'Apparel', 'Accessories']
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one image is required'
      }
    },
    inStock: {
      type: Boolean,
      default: true
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
      default: 0
    },
    daysToMake: {
      type: Number,
      required: true,
      min: [1, 'Production time must be at least 1 day'],
      default: 3
    },
    shippingCost: {
      type: Number,
      required: true,
      min: [0, 'Shipping cost cannot be negative'],
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);

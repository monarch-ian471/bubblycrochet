import mongoose, { Schema, Document } from 'mongoose';

export interface IJourneyResource extends Document {
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  category: 'styles' | 'tools' | 'resources' | 'stores';
  createdAt: Date;
  updatedAt: Date;
}

const JourneyResourceSchema = new Schema<IJourneyResource>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Thumbnail URL is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['styles', 'tools', 'resources', 'stores']
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries by category
JourneyResourceSchema.index({ category: 1, createdAt: -1 });

export default mongoose.model<IJourneyResource>('JourneyResource', JourneyResourceSchema);

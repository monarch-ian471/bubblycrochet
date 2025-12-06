import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  shippingCost: number;
  daysToMake: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  userName: string;
  contactEmail: string;
  shippingAddress: string;
  items: IOrderItem[];
  totalAmount: number;
  shippingTotal: number;
  specialRequest?: string;
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'COMPLETED' | 'CANCELLED';
  estimatedCompletionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  shippingCost: {
    type: Number,
    required: true,
    min: 0
  },
  daysToMake: {
    type: Number,
    required: true,
    min: 1
  }
}, { _id: false });

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    contactEmail: {
      type: String,
      required: true
    },
    shippingAddress: {
      type: String,
      required: [true, 'Shipping address is required']
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (v: IOrderItem[]) => v.length > 0,
        message: 'Order must contain at least one item'
      }
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    shippingTotal: {
      type: Number,
      required: true,
      min: 0
    },
    specialRequest: {
      type: String,
      maxlength: [500, 'Special request cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: ['PENDING', 'REVIEWED', 'ACCEPTED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING'
    },
    estimatedCompletionDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// Indexes
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);

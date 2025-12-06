import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { AuthRequest } from '../middleware/auth';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const orderData = {
      ...req.body,
      userId: req.user!._id,
      userName: req.user!.name,
      contactEmail: req.user!.email
    };

    const order = await Order.create(orderData);
    res.status(201).json({ success: true, order });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user!._id })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name images');
    
    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    
    let query: any = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .populate('items.productId', 'name images');
    
    res.json({ success: true, count: orders.length, orders });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.productId', 'name images');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order or is admin
    if (order.userId.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ success: true, order });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

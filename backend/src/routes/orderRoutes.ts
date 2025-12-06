import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrder,
  updateOrderStatus
} from '../controllers/orderController';
import { protect, admin } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getAllOrders);

router.get('/my-orders', protect, getMyOrders);

router.route('/:id')
  .get(protect, getOrder);

router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;

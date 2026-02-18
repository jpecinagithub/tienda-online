import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  simulateShippingUpdate
} from '../controllers/orderController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticateToken, createOrder);
router.get('/my', authenticateToken, getMyOrders);
router.get('/my/:id', authenticateToken, getOrderById);

router.get('/all', authenticateToken, requireAdmin, getAllOrders);
router.put('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);
router.put('/:id/shipping', authenticateToken, requireAdmin, simulateShippingUpdate);

export default router;

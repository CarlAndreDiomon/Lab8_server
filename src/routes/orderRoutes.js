import express from 'express';
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus, requestCancelOrder, payOrder, confirmOrderReceived } from '../controller/orderController.js';
import protect from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleCheckMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, isAdmin, getAllOrders);
router.get('/myorders', protect, getUserOrders);


router.put('/:id/status', protect, isAdmin, updateOrderStatus);


router.put('/:id/cancel-request', protect, requestCancelOrder);


router.put('/:id/pay', protect, payOrder);


router.put('/:id/receive', protect, confirmOrderReceived);

export default router;
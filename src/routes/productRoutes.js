import express from 'express';
import { addProduct } from '../controller/productController.js';
import protect from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleCheckMiddleware.js';

const router = express.Router();

router.post('/add', protect, isAdmin, addProduct);

export default router;
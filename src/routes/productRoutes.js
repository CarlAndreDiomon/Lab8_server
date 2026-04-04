import express from 'express';
import { addProduct, deleteProduct, editProduct, getProduct } from '../controller/productController.js';
import protect from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleCheckMiddleware.js';

const router = express.Router();

router.post('/add', protect, isAdmin, addProduct);
router.get('/get', protect, getProduct);
router.put('/edit', protect, isAdmin, editProduct);
router.delete('/delete', protect, isAdmin, deleteProduct);

export default router;
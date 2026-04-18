import express from 'express';
import { addProduct, deleteProduct, editProduct, getProduct } from '../controller/productController.js';
import protect from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleCheckMiddleware.js';

import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/add', protect, isAdmin, upload.single('image_url'), addProduct);
router.get('/get', getProduct);
router.put('/edit', protect, isAdmin, upload.single('image_url'), editProduct);
router.delete('/delete', protect, isAdmin, deleteProduct);

export default router;
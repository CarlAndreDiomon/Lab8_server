import express from 'express';
import { getUser, loginUser, logout, registerUser } from '../controller/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getUser',protect, getUser);
router.post('/logout', protect, logout);

export default router;
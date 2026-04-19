import express from 'express';
import { getUser, getAllUsers, loginUser, logout, registerUser } from '../controller/userController.js';
import protect from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/roleCheckMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getUser',protect, getUser);
router.get('/all', protect, isAdmin, getAllUsers);
router.post('/logout', protect, logout);

export default router;
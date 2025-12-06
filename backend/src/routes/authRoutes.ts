import express from 'express';
import { register, login, getMe, adminLogin, deleteAccount } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/me', protect, getMe);
router.delete('/account', protect, deleteAccount);

export default router;

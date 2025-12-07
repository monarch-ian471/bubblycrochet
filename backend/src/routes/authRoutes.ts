import express from 'express';
import { register, login, getMe, adminLogin, deleteAccount, changePassword, requestPasswordReset } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/me', protect, getMe);
router.delete('/account', protect, deleteAccount);
router.put('/change-password', protect, changePassword);
router.post('/reset-password-request', requestPasswordReset);

export default router;

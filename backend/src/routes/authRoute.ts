import { Router } from 'express';
import * as authController from '../controllers/authController';
import authMiddleware from '../middlewares/authmiddleware';

const router = Router();

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/home', authMiddleware, authController.home);
router.post('/refresh-token', authController.refreshTokenHandler);

export default router;

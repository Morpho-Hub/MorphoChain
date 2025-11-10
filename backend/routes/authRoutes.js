import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/me - Get current user profile
router.get('/me', authenticate, async (req, res) => {
    try {
        const user = req.user;
        const maskUser = {
            _id: user._id,
            name: `${user.firstName} ${user.lastName}`.trim() || user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            walletAddress: user.walletAddress,
            profilePicture: user.profilePicture,
            role: user.role,
            isVerified: user.emailVerified,
        };
        res.json({ success: true, data: maskUser });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error fetching user profile' });
    }
});

export default router;

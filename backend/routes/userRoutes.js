import express from 'express';
import { userController } from '../controllers/userController.js';
import { authenticate } from '../middlewares/index.js';
import { validate, validationRules } from '../middlewares/validation.js';

const router = express.Router();

// Public routes (NO require authentication)
router.get('/public/:id', userController.getPublicById);
router.get('/wallet/:address', userController.getUserByWallet);

// All routes below require authentication
router.use(authenticate);

// Profile routes
router.get('/me', userController.getProfile);
router.put('/me', validationRules.updateProfile, validate, userController.updateProfile);
router.put('/me/role', userController.updateRole);

// Stats routes
router.get('/me/farmer-stats', userController.getFarmerStats);
router.get('/me/investor-stats', userController.getInvestorStats);

// Internal routes
router.put('/:id/token-balance', userController.updateTokenBalance);
router.put('/:id/impact', userController.updateImpactMetrics);

export default router;


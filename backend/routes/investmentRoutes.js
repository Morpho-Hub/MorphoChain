import express from 'express';
import { investmentController } from '../controllers/investmentController.js';
import { authenticate, requireInvestor } from '../middlewares/index.js';
import { validate, validationRules } from '../middlewares/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get investments
router.get('/:id', investmentController.getInvestmentById);
router.get('/user/:userId', investmentController.getInvestmentsByUser);
router.get('/farm/:farmId', investmentController.getInvestmentsByFarm);

// Internal routes (called by blockchain service)
router.post('/', investmentController.createInvestment);
router.post('/:id/distribution', investmentController.addDistribution);
router.put('/:id/status', investmentController.updateInvestmentStatus);

export default router;

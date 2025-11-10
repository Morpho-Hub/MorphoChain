import express from 'express';
import { dashboardController } from '../controllers/dashboardController.js';
import { authenticate, requireFarmer, requireInvestor, requireAdmin } from '../middlewares/index.js';

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticate);

// Role-specific dashboards
router.get('/farmer', requireFarmer, dashboardController.getFarmerDashboard);
router.get('/investor', requireInvestor, dashboardController.getInvestorDashboard);
router.get('/admin', requireAdmin, dashboardController.getAdminDashboard);

export default router;

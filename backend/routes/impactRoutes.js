import express from 'express';
import { impactMetricsController } from '../controllers/impactMetricsController.js';
import { authenticate, optionalAuth } from '../middlewares/index.js';

const router = express.Router();

// Public routes
router.get('/platform', impactMetricsController.getPlatformMetrics);
router.get('/leaderboard', impactMetricsController.getLeaderboard);

// Protected routes
router.use(authenticate);

router.get('/user/:userId', impactMetricsController.getMetricsByUser);
router.get('/farm/:farmId', impactMetricsController.getMetricsByFarm);
router.get('/:entityType/:entityId/score', impactMetricsController.calculateImpactScore);

// Internal routes
router.post('/', impactMetricsController.createMetrics);

export default router;

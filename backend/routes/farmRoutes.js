import express from 'express';
import { farmController } from '../controllers/farmController.js';
import { authenticate, optionalAuth, requireFarmer, requireFarmerOrAdmin } from '../middlewares/index.js';
import { validate, validationRules } from '../middlewares/validation.js';

const router = express.Router();

// Public routes
router.get('/public', farmController.getPublicFarms);
router.get('/search', farmController.searchFarms);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.get('/', farmController.getAllFarms);
router.get('/my-farms', farmController.getMyFarms);
router.get('/owner/:userId', farmController.getFarmsByOwner);
router.get('/:id', farmController.getFarmById);

// Farmer only routes
router.post('/', requireFarmer, validationRules.createFarm, validate, farmController.createFarm);
router.put('/:id', requireFarmerOrAdmin, validationRules.updateFarm, validate, farmController.updateFarm);
router.delete('/:id', requireFarmerOrAdmin, farmController.deleteFarm);
router.post('/:id/harvest', requireFarmer, farmController.addHarvest);
router.post('/:id/tokenize', requireFarmer, farmController.tokenizeFarm);

// Internal routes (called by blockchain service)
router.put('/:id/tokenId', farmController.updateFarmTokenId);
router.put('/:id/investment', farmController.updateInvestmentProgress);

export default router;

import express from 'express';
import { productController } from '../controllers/productController.js';
import { authenticate, optionalAuth, requireFarmer, requireFarmerOrAdmin } from '../middlewares/index.js';
import { validate, validationRules } from '../middlewares/validation.js';

const router = express.Router();

// Public routes
router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/search', productController.searchProducts);
router.get('/seller/:userId', productController.getProductsBySeller);
router.get('/:id', optionalAuth, productController.getProductById);

// Protected routes
router.use(authenticate);

// Authenticated user routes
router.get('/my/products', productController.getMyProducts);
router.get('/farm/:farmId', productController.getProductsByFarm);

// Farmer only routes
router.post('/', requireFarmer, validationRules.createProduct, validate, productController.createProduct);
router.put('/:id', requireFarmerOrAdmin, validationRules.updateProduct, validate, productController.updateProduct);
router.delete('/:id', requireFarmerOrAdmin, productController.deleteProduct);

// Rating (any authenticated user)
router.post('/:id/rating', productController.updateProductRating);

// Internal routes
router.put('/:id/listingId', productController.updateProductListingId);
router.put('/:id/stock', productController.reduceStock);

export default router;

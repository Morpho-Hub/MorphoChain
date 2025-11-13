import express from 'express';
import * as blockchainController from '../controllers/blockchainController.js';
import { authenticate } from '../middlewares/auth.js';
import { requireAdmin } from '../middlewares/role.js';

const router = express.Router();

// ============================================
// RUTAS PÚBLICAS (sin autenticación)
// ============================================

// Health check
router.get('/health', blockchainController.healthCheck);

// Token info
router.get('/token/info', blockchainController.getTokenInfo);

// Token balance
router.get('/token/balance/:address', blockchainController.getTokenBalance);

// ETH balance (public)
router.get('/eth/balance/:address', blockchainController.getEthBalance);

// Marketplace - Listings activos
router.get('/marketplace/listings/active', blockchainController.getActiveListings);

// Marketplace - Listing específico
router.get('/marketplace/listing/:listingId', blockchainController.getListing);

// Marketplace - Stats
router.get('/marketplace/stats', blockchainController.getMarketplaceStats);

// Plantation - Info
router.get('/plantation/:plantationId', blockchainController.getPlantation);

// Plantation - Stats
router.get('/plantation/stats', blockchainController.getPlantationStats);

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================

// Wallet del backend (solo admin)
router.get('/wallet', authenticate, requireAdmin, blockchainController.getBackendWallet);

// ============================================
// TOKEN OPERATIONS
// ============================================

// Transferir tokens (admin)
router.post('/token/transfer', authenticate, requireAdmin, blockchainController.transferTokens);

// Mintear tokens (admin)
router.post('/token/mint', authenticate, requireAdmin, blockchainController.mintTokens);

// ============================================
// PLANTATION OPERATIONS
// ============================================

// Registrar plantación (admin)
router.post('/plantation/register', authenticate, requireAdmin, blockchainController.registerPlantation);

// Obtener plantación por wallet
router.get('/plantation/wallet/:walletAddress', authenticate, blockchainController.getPlantationByWallet);

// Mintear a plantación (admin)
router.post('/plantation/mint', authenticate, requireAdmin, blockchainController.mintToPlantation);

// ============================================
// MARKETPLACE OPERATIONS
// ============================================

// Crear listing (autenticado)
router.post('/marketplace/listing', authenticate, blockchainController.createListing);

// Listings de un vendedor
router.get('/marketplace/seller/:sellerAddress/listings', authenticate, blockchainController.getSellerListings);

// Comprar de listing (autenticado)
router.post('/marketplace/buy', authenticate, blockchainController.buyFromListing);

// Calcular costo de compra
router.post('/marketplace/calculate-cost', blockchainController.calculatePurchaseCost);

// Cancelar listing (autenticado)
router.delete('/marketplace/listing/:listingId', authenticate, blockchainController.cancelListing);

export default router;

import morphoCoinService from '../services/morphoCoinService.js';
import plantationService from '../services/plantationService.js';
import marketplaceService from '../services/marketplaceService.js';
import blockchainService from '../services/blockchainService.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

// ============================================
// MORPHOCOIN ENDPOINTS
// ============================================

export const getTokenInfo = asyncHandler(async (req, res) => {
  const tokenInfo = await morphoCoinService.getTokenInfo();
  return successResponse(res, tokenInfo, 'Información del token obtenida exitosamente');
});

export const getTokenBalance = asyncHandler(async (req, res) => {
  const { address } = req.params;
  
  const [balance, availableBalance, frozenBalance] = await Promise.all([
    morphoCoinService.getBalance(address),
    morphoCoinService.getAvailableBalance(address),
    morphoCoinService.getFrozenBalance(address),
  ]);

  return successResponse(res, {
    address,
    totalBalance: balance,
    availableBalance,
    frozenBalance,
  }, 'Balance obtenido exitosamente');
});

/**
 * POST /api/blockchain/token/transfer
 * Transfiere tokens de MorphoCoin
 * Body: { toAddress, amount }
 */
export const transferTokens = asyncHandler(async (req, res) => {
  const { toAddress, amount } = req.body;

  if (!toAddress || !amount) {
    return errorResponse(res, 'toAddress y amount son requeridos', 400);
  }

  const result = await morphoCoinService.transfer(toAddress, amount);

  if (!result.success) {
    return errorResponse(res, result.error, 400);
  }

  return successResponse(res, {
    transactionHash: result.transactionHash,
    blockNumber: result.blockNumber,
    to: toAddress,
    amount,
  }, 'Transferencia exitosa');
});

/**
 * POST /api/blockchain/token/mint
 * Mintea tokens a una dirección (requiere MINTER_ROLE)
 * Body: { toAddress, amount }
 */
export const mintTokens = asyncHandler(async (req, res) => {
  const { toAddress, amount } = req.body;

  if (!toAddress || !amount) {
    return errorResponse(res, 'toAddress y amount son requeridos', 400);
  }

  const result = await morphoCoinService.mintTo(toAddress, amount);

  if (!result.success) {
    return errorResponse(res, result.error, 400);
  }

  return successResponse(res, {
    transactionHash: result.transactionHash,
    blockNumber: result.blockNumber,
    to: toAddress,
    amount,
  }, 'Tokens minteados exitosamente');
});

// ============================================
// PLANTATION ENDPOINTS
// ============================================

/**
 * POST /api/blockchain/plantation/register
 * Registra una nueva plantación
 * Body: { plantationId, walletAddress }
 */
export const registerPlantation = asyncHandler(async (req, res) => {
  const { plantationId, walletAddress } = req.body;

  if (!plantationId || !walletAddress) {
    return errorResponse(res, 'plantationId y walletAddress son requeridos', 400);
  }

  const result = await plantationService.registerPlantation(plantationId, walletAddress);

  if (!result.success) {
    return errorResponse(res, result.error, 400);
  }

  return successResponse(res, {
    transactionHash: result.transactionHash,
    blockNumber: result.blockNumber,
    plantationId,
    walletAddress,
  }, 'Plantación registrada exitosamente');
});

/**
 * GET /api/blockchain/plantation/:plantationId
 * Obtiene información de una plantación
 */
export const getPlantation = asyncHandler(async (req, res) => {
  const { plantationId } = req.params;

  const plantation = await plantationService.getPlantation(plantationId);

  return successResponse(res, plantation, 'Plantación obtenida exitosamente');
});

/**
 * GET /api/blockchain/plantation/wallet/:walletAddress
 * Obtiene el ID de plantación por dirección de wallet
 */
export const getPlantationByWallet = asyncHandler(async (req, res) => {
  const { walletAddress } = req.params;

  const plantationId = await plantationService.getPlantationByWallet(walletAddress);

  if (!plantationId) {
    return errorResponse(res, 'No se encontró plantación para esta wallet', 404);
  }

  return successResponse(res, { plantationId, walletAddress }, 'Plantación encontrada');
});

/**
 * POST /api/blockchain/plantation/mint
 * Mintea tokens a una plantación
 * Body: { plantationId, amount }
 */
export const mintToPlantation = asyncHandler(async (req, res) => {
  const { plantationId, amount } = req.body;

  if (!plantationId || !amount) {
    return errorResponse(res, 'plantationId y amount son requeridos', 400);
  }

  const result = await plantationService.mintToPlantation(plantationId, amount);

  if (!result.success) {
    return errorResponse(res, result.error, 400);
  }

  return successResponse(res, {
    transactionHash: result.transactionHash,
    blockNumber: result.blockNumber,
    plantationId,
    amount,
  }, 'Tokens minteados a plantación exitosamente');
});

/**
 * GET /api/blockchain/plantation/stats
 * Obtiene estadísticas generales de plantaciones
 */
export const getPlantationStats = asyncHandler(async (req, res) => {
  const stats = await plantationService.getPlantationStats();
  return successResponse(res, stats, 'Estadísticas obtenidas exitosamente');
});

// ============================================
// MARKETPLACE ENDPOINTS
// ============================================

/**
 * POST /api/blockchain/marketplace/listing
 * Crea un nuevo listing en el marketplace
 * Body: { amount, pricePerToken }
 */
export const createListing = asyncHandler(async (req, res) => {
  const { amount, pricePerToken } = req.body;

  if (!amount || !pricePerToken) {
    return errorResponse(res, 'amount y pricePerToken son requeridos', 400);
  }

  const result = await marketplaceService.createListing(amount, pricePerToken);

  if (!result.success) {
    return errorResponse(res, result.error, 400);
  }

  return successResponse(res, {
    transactionHash: result.transactionHash,
    blockNumber: result.blockNumber,
    listingId: result.listingId,
    amount,
    pricePerToken,
  }, 'Listing creado exitosamente');
});

/**
 * GET /api/blockchain/marketplace/listing/:listingId
 * Obtiene información de un listing específico
 */
export const getListing = asyncHandler(async (req, res) => {
  const { listingId } = req.params;

  const listing = await marketplaceService.getListing(listingId);

  return successResponse(res, listing, 'Listing obtenido exitosamente');
});

/**
 * GET /api/blockchain/marketplace/listings/active
 * Obtiene todos los listings activos
 */
export const getActiveListings = asyncHandler(async (req, res) => {
  const listings = await marketplaceService.getActiveListings();
  return successResponse(res, { listings, total: listings.length }, 'Listings activos obtenidos');
});

/**
 * GET /api/blockchain/marketplace/seller/:sellerAddress/listings
 * Obtiene los listings de un vendedor específico
 */
export const getSellerListings = asyncHandler(async (req, res) => {
  const { sellerAddress } = req.params;

  const listings = await marketplaceService.getSellerListings(sellerAddress);

  return successResponse(res, { 
    seller: sellerAddress,
    listings, 
    total: listings.length 
  }, 'Listings del vendedor obtenidos');
});

/**
 * POST /api/blockchain/marketplace/buy
 * Compra tokens de un listing
 * Body: { listingId, amount }
 */
export const buyFromListing = asyncHandler(async (req, res) => {
  const { listingId, amount } = req.body;

  if (!listingId || !amount) {
    return errorResponse(res, 'listingId y amount son requeridos', 400);
  }

  const result = await marketplaceService.buyFromListing(listingId, amount);

  if (!result.success) {
    return errorResponse(res, result.error, 400);
  }

  return successResponse(res, {
    transactionHash: result.transactionHash,
    blockNumber: result.blockNumber,
    listingId,
    amount,
  }, 'Compra realizada exitosamente');
});

/**
 * DELETE /api/blockchain/marketplace/listing/:listingId
 * Cancela un listing
 */
export const cancelListing = asyncHandler(async (req, res) => {
  const { listingId } = req.params;

  const result = await marketplaceService.cancelListing(listingId);

  if (!result.success) {
    return errorResponse(res, result.error, 400);
  }

  return successResponse(res, {
    transactionHash: result.transactionHash,
    blockNumber: result.blockNumber,
    listingId,
  }, 'Listing cancelado exitosamente');
});

/**
 * GET /api/blockchain/marketplace/stats
 * Obtiene estadísticas del marketplace
 */
export const getMarketplaceStats = asyncHandler(async (req, res) => {
  const stats = await marketplaceService.getMarketplaceStats();
  return successResponse(res, stats, 'Estadísticas del marketplace obtenidas');
});

/**
 * POST /api/blockchain/marketplace/calculate-cost
 * Calcula el costo de comprar cierta cantidad de un listing
 * Body: { listingId, amount }
 */
export const calculatePurchaseCost = asyncHandler(async (req, res) => {
  const { listingId, amount } = req.body;

  if (!listingId || !amount) {
    return errorResponse(res, 'listingId y amount son requeridos', 400);
  }

  const cost = await marketplaceService.calculatePurchaseCost(listingId, amount);

  return successResponse(res, cost, 'Costo calculado exitosamente');
});

// ============================================
// GENERAL BLOCKCHAIN ENDPOINTS
// ============================================

/**
 * GET /api/blockchain/health
 * Verifica el estado de la conexión blockchain
 */
export const healthCheck = asyncHandler(async (req, res) => {
  const health = await blockchainService.healthCheck();

  if (health.status === 'error') {
    return errorResponse(res, health.message, 503);
  }

  return successResponse(res, health, 'Blockchain conectado correctamente');
});

/**
 * GET /api/blockchain/wallet
 * Obtiene información de la wallet del backend
 */
export const getBackendWallet = asyncHandler(async (req, res) => {
  const address = await blockchainService.getBackendWalletAddress();
  const ethBalance = await blockchainService.getETHBalance(address);
  const tokenBalance = await morphoCoinService.getBalance(address);

  return successResponse(res, {
    address,
    ethBalance,
    morphoCoinBalance: tokenBalance,
  }, 'Información de wallet obtenida');
});


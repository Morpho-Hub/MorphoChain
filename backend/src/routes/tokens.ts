import { Router } from 'express';
import { TokenController } from '../controllers/tokenController';

const router = Router();

// @route   POST /api/tokens
// @desc    Create a new token
// @access  Public
router.post('/', TokenController.createToken);

// @route   GET /api/tokens
// @desc    Get all tokens with populated finca and owner data
// @access  Public
router.get('/', TokenController.getAllTokens);

// @route   GET /api/tokens/:id
// @desc    Get token by ID with populated finca and owner data
// @access  Public
router.get('/:id', TokenController.getToken);

// @route   PUT /api/tokens/:id
// @desc    Update token by ID
// @access  Public
router.put('/:id', TokenController.updateToken);

// @route   DELETE /api/tokens/:id
// @desc    Delete token by ID
// @access  Public
router.delete('/:id', TokenController.deleteToken);

// @route   GET /api/tokens/blockchain/:tokenIdBlockchain
// @desc    Get token by blockchain ID with populated finca and owner data
// @access  Public
router.get('/blockchain/:tokenIdBlockchain', TokenController.getTokenByBlockchainId);

// @route   GET /api/tokens/finca/:fincaId
// @desc    Get all tokens by finca ID
// @access  Public
router.get('/finca/:fincaId', TokenController.getTokensByFinca);

// @route   GET /api/tokens/owner/:ownerId
// @desc    Get all tokens by owner ID
// @access  Public
router.get('/owner/:ownerId', TokenController.getTokensByOwner);

// @route   POST /api/tokens/:id/transfers
// @desc    Add transfer to token's transfer history and update owner
// @access  Public
router.post('/:id/transfers', TokenController.addTransfer);

// @route   PATCH /api/tokens/:id/status
// @desc    Update token status by ID
// @access  Public
router.patch('/:id/status', TokenController.updateTokenStatus);

export default router;
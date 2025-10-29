import { Router } from 'express';
import { FincaController } from '../controllers/fincaController';

const router = Router();

// @route   POST /api/fincas
// @desc    Create a new finca
// @access  Public
router.post('/', FincaController.createFinca);

// @route   GET /api/fincas
// @desc    Get all fincas with populated crops, tokens and owner
// @access  Public
router.get('/', FincaController.getAllFincas);

// @route   GET /api/fincas/:id
// @desc    Get finca by ID with populated crops, tokens and owner
// @access  Public
router.get('/:id', FincaController.getFinca);

// @route   PUT /api/fincas/:id
// @desc    Update finca by ID
// @access  Public
router.put('/:id', FincaController.updateFinca);

// @route   DELETE /api/fincas/:id
// @desc    Delete finca by ID
// @access  Public
router.delete('/:id', FincaController.deleteFinca);

// @route   GET /api/fincas/owner/:ownerId
// @desc    Get all fincas by owner ID
// @access  Public
router.get('/owner/:ownerId', FincaController.getFincasByOwner);

// @route   POST /api/fincas/:id/crops
// @desc    Add crop to finca's crops array
// @access  Public
router.post('/:id/crops', FincaController.addCrop);

// @route   POST /api/fincas/:id/tokens
// @desc    Add token to finca's tokens array
// @access  Public
router.post('/:id/tokens', FincaController.addToken);

export default router;
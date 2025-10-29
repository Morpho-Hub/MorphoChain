import { Router } from 'express';
import { CropController } from '../controllers/cropController';

const router = Router();

// @route   POST /api/crops
// @desc    Create a new crop
// @access  Public
router.post('/', CropController.createCrop);

// @route   GET /api/crops
// @desc    Get all crops with populated finca data
// @access  Public
router.get('/', CropController.getAllCrops);

// @route   GET /api/crops/:id
// @desc    Get crop by ID with populated finca data
// @access  Public
router.get('/:id', CropController.getCrop);

// @route   PUT /api/crops/:id
// @desc    Update crop by ID
// @access  Public
router.put('/:id', CropController.updateCrop);

// @route   DELETE /api/crops/:id
// @desc    Delete crop by ID
// @access  Public
router.delete('/:id', CropController.deleteCrop);

// @route   GET /api/crops/finca/:fincaId
// @desc    Get all crops by finca ID
// @access  Public
router.get('/finca/:fincaId', CropController.getCropsByFinca);

// @route   PATCH /api/crops/:id/status
// @desc    Update crop status by ID
// @access  Public
router.patch('/:id/status', CropController.updateCropStatus);

export default router;
import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';
import { MESSAGES } from '../constants/messages.js';

/**
 * Middleware to handle validation errors from express-validator
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));

    return errorResponse(
      res,
      MESSAGES.GENERAL.VALIDATION_ERROR,
      400,
      formattedErrors
    );
  }

  next();
};

/**
 * Common validation rules
 */
import { body, param, query } from 'express-validator';

export const validationRules = {
  // User validations
  updateProfile: [
    body('firstName').optional().trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    body('lastName').optional().trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
    body('bio').optional().isLength({ max: 500 }).withMessage('Bio must not exceed 500 characters'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('country').optional().trim(),
  ],

  // Farm validations
  createFarm: [
    body('name').trim().notEmpty().withMessage('Farm name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('landSize').isFloat({ min: 0.1 }).withMessage('Land size must be greater than 0'),
    body('cropType').trim().notEmpty().withMessage('Crop type is required'),
    body('investmentGoal').isFloat({ min: 100 }).withMessage('Investment goal must be at least 100'),
    body('location.country').trim().notEmpty().withMessage('Country is required'),
  ],

  updateFarm: [
    body('name').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('landSize').optional().isFloat({ min: 0.1 }),
    body('status').optional().isIn(['draft', 'pending', 'active', 'funded', 'completed', 'cancelled']),
  ],

  // Product validations
  createProduct: [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').isIn(['coffee', 'cacao', 'fruits', 'vegetables', 'grains', 'honey', 'other']).withMessage('Invalid category'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be greater than or equal to 0'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('unit').trim().notEmpty().withMessage('Unit is required'),
  ],

  updateProduct: [
    body('name').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('stock').optional().isInt({ min: 0 }),
    body('status').optional().isIn(['draft', 'active', 'out-of-stock', 'discontinued', 'pending']),
  ],

  // Investment validations
  createInvestment: [
    body('farmId').notEmpty().isMongoId().withMessage('Valid farm ID is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be greater than 0'),
    body('transactionHash').optional().trim().notEmpty(),
  ],

  // Pagination validations
  pagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be at least 1').toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100').toInt(),
  ],

  // MongoDB ID validation
  mongoId: [
    param('id').isMongoId().withMessage('Invalid ID format'),
  ],
};

import { errorResponse } from '../utils/apiResponse.js';
import { MESSAGES } from '../constants/messages.js';

/**
 * Middleware to check if user has required role(s)
 * @param {string|string[]} roles - Single role or array of roles
 */
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, MESSAGES.AUTH.UNAUTHORIZED, 401);
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        MESSAGES.ROLE.INSUFFICIENT_PERMISSIONS,
        403,
        { requiredRoles: allowedRoles, userRole: req.user.role }
      );
    }

    next();
  };
};

/**
 * Middleware to check if user is a farmer
 */
export const requireFarmer = requireRole('farmer');

/**
 * Middleware to check if user is an investor
 */
export const requireInvestor = requireRole('investor');

/**
 * Middleware to check if user is an admin
 */
export const requireAdmin = requireRole('admin');

/**
 * Middleware to check if user is farmer or admin
 */
export const requireFarmerOrAdmin = requireRole(['farmer', 'admin']);

/**
 * Middleware to check if user is investor or admin
 */
export const requireInvestorOrAdmin = requireRole(['investor', 'admin']);

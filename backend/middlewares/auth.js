import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { errorResponse } from '../utils/apiResponse.js';
import { MESSAGES } from '../constants/messages.js';

/**
 * Middleware to verify JWT token and authenticate user
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, MESSAGES.AUTH.UNAUTHORIZED, 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return errorResponse(res, MESSAGES.AUTH.INVALID_TOKEN, 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret');

    // Get user from database
    const user = await User.findById(decoded.userId).select('-emailVerificationToken');

    if (!user) {
      return errorResponse(res, MESSAGES.USER.NOT_FOUND, 404);
    }

    // Check if user is active
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    if (user.isBanned) {
      return errorResponse(res, `Account is banned: ${user.banReason}`, 403);
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return errorResponse(res, MESSAGES.AUTH.INVALID_TOKEN, 401);
    }
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token expired', 401);
    }
    return errorResponse(res, MESSAGES.GENERAL.SERVER_ERROR, 500);
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_jwt_secret');
    const user = await User.findById(decoded.userId);

    if (user && user.isActive && !user.isBanned) {
      req.user = user;
      req.userId = user._id;
      req.userRole = user.role;
    }

    next();
  } catch (error) {
    // Silently fail - just proceed without user
    next();
  }
};

import { User, Farm, Investment, Product } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import jwt from 'jsonwebtoken';

export const userController = {
  /**
   * Get current user profile
   * GET /api/users/me
   */
  getProfile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId).select('-emailVerificationToken');
    
    if (!user) {
      return errorResponse(res, MESSAGES.USER.NOT_FOUND, 404);
    }

    return successResponse(res, user, 'Profile retrieved successfully');
  }),

  /**
   * Update user profile
   * PUT /api/users/me
   */
  updateProfile: asyncHandler(async (req, res) => {
    const userId = req.userId;
    
    // Fields that can be updated
    const allowedFields = [
      'firstName', 'lastName', 'bio', 'phone', 'country', 'language',
      'preferences'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-emailVerificationToken');

    return successResponse(res, user, MESSAGES.USER.PROFILE_UPDATED);
  }),

  /**
   * Update user role
   * PUT /api/users/me/role
   */
  updateRole: asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { role } = req.body;

    if (!['farmer', 'investor'].includes(role)) {
      return errorResponse(res, 'Invalid role. Must be farmer or investor', 400);
    }

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, MESSAGES.USER.NOT_FOUND, 404);
    }

    user.role = role;
    user.updatedAt = new Date();

    await user.save();

    return successResponse(res, user, 'Role updated successfully');
  }),

  /**
   * Get farmer statistics
   * GET /api/users/me/farmer-stats
   */
  getFarmerStats: asyncHandler(async (req, res) => {
    const userId = req.userId;

    if (req.userRole !== 'farmer') {
      return errorResponse(res, MESSAGES.ROLE.FARMER_ONLY, 403);
    }

    // Get farms
    const farms = await Farm.find({ owner: userId });
    
    // Get total investments received
    const investments = await Investment.find({
      farm: { $in: farms.map(f => f._id) },
      status: { $in: ['confirmed', 'active'] }
    });

    // Get products
    const products = await Product.find({ seller: userId });

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalRevenue = products.reduce((sum, prod) => sum + prod.revenue, 0);
    const activeFarms = farms.filter(f => f.status === 'active').length;
    const activeProducts = products.filter(p => p.status === 'active').length;

    const stats = {
      totalFarms: farms.length,
      activeFarms,
      totalInvestmentsReceived: investments.length,
      totalInvestedAmount: totalInvested,
      totalProducts: products.length,
      activeProducts,
      totalRevenue,
      averageFarmSize: farms.length > 0 
        ? farms.reduce((sum, f) => sum + f.landSize, 0) / farms.length 
        : 0
    };

    return successResponse(res, stats, 'Farmer stats retrieved successfully');
  }),

  /**
   * Get investor statistics
   * GET /api/users/me/investor-stats
   */
  getInvestorStats: asyncHandler(async (req, res) => {
    const userId = req.userId;

    if (req.userRole !== 'investor') {
      return errorResponse(res, MESSAGES.ROLE.INVESTOR_ONLY, 403);
    }

    // Get investments
    const investments = await Investment.find({
      investor: userId,
      status: { $in: ['confirmed', 'active', 'completed'] }
    }).populate('farm', 'name cropType');

    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalReturns = investments.reduce((sum, inv) => sum + inv.currentReturn, 0);
    const activeInvestments = investments.filter(inv => inv.status === 'active').length;

    const roi = totalInvested > 0 ? ((totalReturns - totalInvested) / totalInvested) * 100 : 0;

    const stats = {
      totalInvestments: investments.length,
      activeInvestments,
      totalInvested,
      totalReturns,
      roi: roi.toFixed(2),
      netProfit: totalReturns - totalInvested,
      investments: investments.map(inv => ({
        id: inv._id,
        farm: inv.farm,
        amount: inv.amount,
        currentReturn: inv.currentReturn,
        status: inv.status,
        investmentDate: inv.investmentDate
      }))
    };

    return successResponse(res, stats, 'Investor stats retrieved successfully');
  }),

  /**
   * Get user by wallet address (with JWT token for authentication)
   * GET /api/users/wallet/:address
   */
  getUserByWallet: asyncHandler(async (req, res) => {
    const { address } = req.params;

    const user = await User.findOne({ walletAddress: address.toLowerCase() })
      .select('-emailVerificationToken');

    if (!user) {
      return errorResponse(res, MESSAGES.USER.NOT_FOUND, 404);
    }

    // Generate JWT token for the user (like in login)
    const token = jwt.sign(
      { userId: user._id, walletAddress: user.walletAddress, role: user.role },
      process.env.JWT_SECRET || 'dev_jwt_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return successResponse(res, { user, token }, 'User retrieved successfully');
  }),

  /**
   * Update token balance (internal - called by blockchain service)
   * PUT /api/users/:id/token-balance
   */
  updateTokenBalance: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { balance } = req.body;

    if (balance === undefined || balance < 0) {
      return errorResponse(res, 'Valid balance is required', 400);
    }

    const user = await User.findByIdAndUpdate(
      id,
      { tokenBalance: balance, updatedAt: new Date() },
      { new: true }
    ).select('-emailVerificationToken');

    if (!user) {
      return errorResponse(res, MESSAGES.USER.NOT_FOUND, 404);
    }

    return successResponse(res, user, 'Token balance updated successfully');
  }),

  /**
   * Update impact metrics (internal)
   * PUT /api/users/:id/impact
   */
  updateImpactMetrics: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { impactMetrics } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { impactMetrics, updatedAt: new Date() },
      { new: true }
    ).select('-emailVerificationToken');

    if (!user) {
      return errorResponse(res, MESSAGES.USER.NOT_FOUND, 404);
    }

    return successResponse(res, user, 'Impact metrics updated successfully');
  }),
};

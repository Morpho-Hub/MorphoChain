import { Investment, Farm, User, Transaction } from '../models/index.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

export const investmentController = {
  /**
   * Create investment (called by blockchain service after successful transaction)
   * POST /api/investments
   */
  createInvestment: asyncHandler(async (req, res) => {
    const {
      investorId,
      investorWallet,
      farmId,
      amount,
      amountInTokens,
      transactionHash,
      blockNumber,
      contractAddress,
    } = req.body;

    // Validate farm exists
    const farm = await Farm.findById(farmId);
    if (!farm) {
      return errorResponse(res, MESSAGES.FARM.NOT_FOUND, 404);
    }

    // Calculate percentage
    const percentage = (amount / farm.investmentGoal) * 100;

    // Create investment
    const investment = new Investment({
      investor: investorId,
      investorWallet: investorWallet.toLowerCase(),
      farm: farmId,
      farmTokenId: farm.tokenId,
      amount,
      amountInTokens,
      percentage,
      transactionHash,
      blockNumber,
      contractAddress,
      status: 'confirmed',
      investmentDate: new Date(),
      expectedReturn: amount * (farm.expectedROI / 100 || 0),
    });

    await investment.save();

    // Update farm investment progress
    farm.currentInvestment += amount;
    farm.investorsCount += 1;
    if (farm.currentInvestment >= farm.investmentGoal) {
      farm.status = 'funded';
    }
    await farm.save();

    // Update user investor data
    await User.findByIdAndUpdate(investorId, {
      $inc: {
        'investorData.totalInvested': amount,
        'investorData.activeInvestments': 1,
      },
    });

    return successResponse(res, investment, MESSAGES.INVESTMENT.CREATED, 201);
  }),

  /**
   * Get investment by ID
   * GET /api/investments/:id
   */
  getInvestmentById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const investment = await Investment.findById(id)
      .populate('investor', 'firstName lastName profilePicture email')
      .populate('farm', 'name cropType location coverImage')
      .lean();

    if (!investment) {
      return errorResponse(res, MESSAGES.INVESTMENT.NOT_FOUND, 404);
    }

    return successResponse(res, investment, 'Investment retrieved successfully');
  }),

  /**
   * Get investments by user
   * GET /api/investments/user/:userId
   */
  getInvestmentsByUser: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { investor: userId };
    if (status) filter.status = status;

    const [investments, total] = await Promise.all([
      Investment.find(filter)
        .populate('farm', 'name cropType location coverImage status')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Investment.countDocuments(filter),
    ]);

    return paginatedResponse(res, investments, page, limit, total, 'User investments retrieved successfully');
  }),

  /**
   * Get investments by farm
   * GET /api/investments/farm/:farmId
   */
  getInvestmentsByFarm: asyncHandler(async (req, res) => {
    const { farmId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [investments, total] = await Promise.all([
      Investment.find({ farm: farmId, status: { $in: ['confirmed', 'active'] } })
        .populate('investor', 'firstName lastName profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Investment.countDocuments({ farm: farmId, status: { $in: ['confirmed', 'active'] } }),
    ]);

    return paginatedResponse(res, investments, page, limit, total, 'Farm investments retrieved successfully');
  }),

  /**
   * Add distribution/dividend
   * POST /api/investments/:id/distribution
   */
  addDistribution: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { amount, type, transactionHash, notes } = req.body;

    const investment = await Investment.findById(id);

    if (!investment) {
      return errorResponse(res, MESSAGES.INVESTMENT.NOT_FOUND, 404);
    }

    const distribution = {
      date: new Date(),
      amount,
      type: type || 'dividend',
      transactionHash,
      notes,
    };

    investment.distributions.push(distribution);
    investment.totalDistributed += amount;
    investment.currentReturn += amount;

    await investment.save();

    return successResponse(res, investment, 'Distribution added successfully');
  }),

  /**
   * Update investment status
   * PUT /api/investments/:id/status
   */
  updateInvestmentStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'failed'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, 'Invalid status', 400);
    }

    const investment = await Investment.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!investment) {
      return errorResponse(res, MESSAGES.INVESTMENT.NOT_FOUND, 404);
    }

    return successResponse(res, investment, 'Investment status updated successfully');
  }),
};

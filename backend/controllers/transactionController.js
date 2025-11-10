import { Transaction, User } from '../models/index.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

export const transactionController = {
  /**
   * Create transaction (internal - called by blockchain service)
   * POST /api/transactions
   */
  createTransaction: asyncHandler(async (req, res) => {
    const transactionData = {
      ...req.body,
      initiatedAt: new Date(),
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();

    return successResponse(res, transaction, MESSAGES.TRANSACTION.CREATED, 201);
  }),

  /**
   * Get transaction by ID
   * GET /api/transactions/:id
   */
  getTransactionById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const transaction = await Transaction.findById(id)
      .populate('from', 'firstName lastName walletAddress')
      .populate('to', 'firstName lastName walletAddress')
      .populate('relatedFarm', 'name')
      .populate('relatedProduct', 'name')
      .lean();

    if (!transaction) {
      return errorResponse(res, MESSAGES.TRANSACTION.NOT_FOUND, 404);
    }

    return successResponse(res, transaction, 'Transaction retrieved successfully');
  }),

  /**
   * Get transaction by hash
   * GET /api/transactions/hash/:hash
   */
  getTransactionByHash: asyncHandler(async (req, res) => {
    const { hash } = req.params;

    const transaction = await Transaction.findOne({ transactionHash: hash })
      .populate('from', 'firstName lastName walletAddress')
      .populate('to', 'firstName lastName walletAddress')
      .lean();

    if (!transaction) {
      return errorResponse(res, MESSAGES.TRANSACTION.NOT_FOUND, 404);
    }

    return successResponse(res, transaction, 'Transaction retrieved successfully');
  }),

  /**
   * Get transactions by user
   * GET /api/transactions/user/:userId
   */
  getTransactionsByUser: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 20, type, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = {
      $or: [{ from: userId }, { to: userId }],
    };

    if (type) filter.type = type;
    if (status) filter.status = status;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate('from', 'firstName lastName')
        .populate('to', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Transaction.countDocuments(filter),
    ]);

    return paginatedResponse(res, transactions, page, limit, total, 'Transactions retrieved successfully');
  }),

  /**
   * Get transactions by wallet
   * GET /api/transactions/wallet/:address
   */
  getTransactionsByWallet: asyncHandler(async (req, res) => {
    const { address } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const wallet = address.toLowerCase();
    const filter = {
      $or: [{ fromWallet: wallet }, { toWallet: wallet }],
    };

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Transaction.countDocuments(filter),
    ]);

    return paginatedResponse(res, transactions, page, limit, total, 'Wallet transactions retrieved successfully');
  }),

  /**
   * Update transaction status
   * PUT /api/transactions/:id/status
   */
  updateTransactionStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, errorMessage, confirmations } = req.body;

    const updateData = { status, updatedAt: new Date() };

    if (errorMessage) updateData.errorMessage = errorMessage;
    if (confirmations !== undefined) updateData.confirmations = confirmations;

    if (status === 'completed') {
      updateData.completedAt = new Date();
    } else if (status === 'processing') {
      updateData.processedAt = new Date();
    }

    const transaction = await Transaction.findByIdAndUpdate(id, updateData, { new: true });

    if (!transaction) {
      return errorResponse(res, MESSAGES.TRANSACTION.NOT_FOUND, 404);
    }

    return successResponse(res, transaction, 'Transaction status updated successfully');
  }),

  /**
   * Get user's transaction history with summary
   * GET /api/transactions/user/:userId/summary
   */
  getTransactionSummary: asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const transactions = await Transaction.find({
      $or: [{ from: userId }, { to: userId }],
      status: 'completed',
    });

    const summary = {
      totalTransactions: transactions.length,
      totalSent: 0,
      totalReceived: 0,
      byType: {},
    };

    transactions.forEach((tx) => {
      if (tx.from?.toString() === userId) {
        summary.totalSent += tx.amount;
      }
      if (tx.to?.toString() === userId) {
        summary.totalReceived += tx.amount;
      }

      if (!summary.byType[tx.type]) {
        summary.byType[tx.type] = { count: 0, totalAmount: 0 };
      }
      summary.byType[tx.type].count += 1;
      summary.byType[tx.type].totalAmount += tx.amount;
    });

    return successResponse(res, summary, 'Transaction summary retrieved successfully');
  }),
};

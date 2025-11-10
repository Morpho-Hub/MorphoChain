import { Farm, Investment, Product, Transaction, User } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

export const dashboardController = {
  /**
   * Get Farmer Dashboard Data
   * GET /api/dashboard/farmer
   */
  getFarmerDashboard: asyncHandler(async (req, res) => {
    const userId = req.userId;

    if (req.userRole !== 'farmer') {
      return errorResponse(res, 'Only farmers can access this dashboard', 403);
    }

    // Get all farmer's farms
    const farms = await Farm.find({ owner: userId }).lean();
    const farmIds = farms.map(f => f._id);

    // Get investments received
    const investments = await Investment.find({
      farm: { $in: farmIds },
      status: { $in: ['confirmed', 'active'] }
    }).populate('investor', 'firstName lastName profilePicture');

    // Get products
    const products = await Product.find({ seller: userId });

    // Get recent transactions
    const transactions = await Transaction.find({
      to: userId,
      type: { $in: ['investment', 'dividend', 'harvest-sale'] }
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Calculate metrics
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalRevenue = products.reduce((sum, prod) => sum + prod.revenue, 0);
    const activeFarms = farms.filter(f => f.status === 'active').length;
    const pendingFarms = farms.filter(f => f.status === 'pending').length;

    // Impact metrics
    const totalCO2Reduced = farms.reduce((sum, f) => sum + (f.impactMetrics?.co2Reduction || 0), 0);
    const totalJobsCreated = farms.reduce((sum, f) => sum + (f.socialImpact?.jobsCreated || 0), 0);

    const dashboard = {
      overview: {
        totalFarms: farms.length,
        activeFarms,
        pendingFarms,
        totalInvestmentsReceived: investments.length,
        totalInvestedAmount: totalInvested,
        totalProducts: products.length,
        totalRevenue,
      },
      farms: farms.slice(0, 5), // Top 5 farms
      recentInvestments: investments.slice(0, 5),
      recentTransactions: transactions,
      impactMetrics: {
        co2Reduced: totalCO2Reduced,
        jobsCreated: totalJobsCreated,
        treesPlanted: farms.reduce((sum, f) => sum + (f.impactMetrics?.treesPlanted || 0), 0),
      },
    };

    return successResponse(res, dashboard, 'Farmer dashboard retrieved successfully');
  }),

  /**
   * Get Investor Dashboard Data
   * GET /api/dashboard/investor
   */
  getInvestorDashboard: asyncHandler(async (req, res) => {
    const userId = req.userId;

    if (req.userRole !== 'investor') {
      return errorResponse(res, 'Only investors can access this dashboard', 403);
    }

    // Get all investments
    const investments = await Investment.find({
      investor: userId,
      status: { $in: ['confirmed', 'active', 'completed'] }
    }).populate('farm', 'name cropType coverImage location status currentInvestment investmentGoal');

    // Get recent transactions
    const transactions = await Transaction.find({
      from: userId,
      type: { $in: ['investment', 'product-purchase'] }
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Calculate metrics
    const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalReturns = investments.reduce((sum, inv) => sum + inv.currentReturn, 0);
    const activeInvestments = investments.filter(inv => inv.status === 'active').length;
    const roi = totalInvested > 0 ? ((totalReturns - totalInvested) / totalInvested) * 100 : 0;

    // Portfolio distribution by crop type
    const portfolioDistribution = {};
    investments.forEach(inv => {
      const cropType = inv.farm?.cropType || 'Other';
      if (!portfolioDistribution[cropType]) {
        portfolioDistribution[cropType] = 0;
      }
      portfolioDistribution[cropType] += inv.amount;
    });

    // Impact contribution
    const impactContribution = investments.reduce(
      (acc, inv) => ({
        co2Reduced: acc.co2Reduced + (inv.impactContribution?.co2Reduced || 0),
        waterSaved: acc.waterSaved + (inv.impactContribution?.waterSaved || 0),
        treesPlanted: acc.treesPlanted + (inv.impactContribution?.treesPlanted || 0),
      }),
      { co2Reduced: 0, waterSaved: 0, treesPlanted: 0 }
    );

    const dashboard = {
      overview: {
        totalInvestments: investments.length,
        activeInvestments,
        totalInvested,
        totalReturns,
        roi: roi.toFixed(2),
        netProfit: totalReturns - totalInvested,
        portfolioValue: totalInvested + (totalReturns - totalInvested),
      },
      investments: investments.slice(0, 8), // Top 8 investments
      portfolioDistribution,
      recentTransactions: transactions,
      impactContribution,
    };

    return successResponse(res, dashboard, 'Investor dashboard retrieved successfully');
  }),

  /**
   * Get Admin Dashboard Data
   * GET /api/dashboard/admin
   */
  getAdminDashboard: asyncHandler(async (req, res) => {
    if (req.userRole !== 'admin') {
      return errorResponse(res, 'Only admins can access this dashboard', 403);
    }

    // Get counts
    const [
      totalUsers,
      totalFarmers,
      totalInvestors,
      totalFarms,
      activeFarms,
      totalProducts,
      totalInvestments,
      totalTransactions,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'investor' }),
      Farm.countDocuments(),
      Farm.countDocuments({ status: 'active' }),
      Product.countDocuments(),
      Investment.countDocuments(),
      Transaction.countDocuments(),
    ]);

    // Get total investment volume
    const investmentVolume = await Investment.aggregate([
      { $match: { status: { $in: ['confirmed', 'active', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    // Get recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email role createdAt')
      .lean();

    const recentFarms = await Farm.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('owner', 'firstName lastName')
      .lean();

    const dashboard = {
      overview: {
        totalUsers,
        totalFarmers,
        totalInvestors,
        totalFarms,
        activeFarms,
        totalProducts,
        totalInvestments,
        totalTransactions,
        totalInvestmentVolume: investmentVolume[0]?.total || 0,
      },
      recentUsers,
      recentFarms,
    };

    return successResponse(res, dashboard, 'Admin dashboard retrieved successfully');
  }),
};

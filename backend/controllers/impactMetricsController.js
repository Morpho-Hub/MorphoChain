import { ImpactMetrics, User, Farm } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

export const impactMetricsController = {
  /**
   * Get metrics by user
   * GET /api/impact/user/:userId
   */
  getMetricsByUser: asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const metrics = await ImpactMetrics.findOne({
      entityType: 'user',
      user: userId,
    }).lean();

    if (!metrics) {
      // Return empty metrics if none exist yet
      return successResponse(res, {
        environmental: {},
        social: {},
        economic: {},
        overallImpactScore: 0,
      }, 'No metrics found for this user');
    }

    return successResponse(res, metrics, 'User metrics retrieved successfully');
  }),

  /**
   * Get metrics by farm
   * GET /api/impact/farm/:farmId
   */
  getMetricsByFarm: asyncHandler(async (req, res) => {
    const { farmId } = req.params;

    const metrics = await ImpactMetrics.findOne({
      entityType: 'farm',
      farm: farmId,
    }).lean();

    if (!metrics) {
      return successResponse(res, {
        environmental: {},
        social: {},
        economic: {},
        overallImpactScore: 0,
      }, 'No metrics found for this farm');
    }

    return successResponse(res, metrics, 'Farm metrics retrieved successfully');
  }),

  /**
   * Get platform-wide metrics
   * GET /api/impact/platform
   */
  getPlatformMetrics: asyncHandler(async (req, res) => {
    // Aggregate all metrics
    const allMetrics = await ImpactMetrics.find({ isPublic: true });

    const platformMetrics = {
      environmental: {
        co2Reduced: 0,
        waterSaved: 0,
        treesPlanted: 0,
        organicArea: 0,
      },
      social: {
        jobsCreated: 0,
        familiesSupported: 0,
        peopleEducated: 0,
        communityInvestment: 0,
      },
      economic: {
        totalInvestment: 0,
        revenueGenerated: 0,
        farmersIncome: 0,
        productsSold: 0,
      },
      totalUsers: await User.countDocuments(),
      totalFarms: await Farm.countDocuments({ status: 'active' }),
      averageImpactScore: 0,
    };

    let scoreSum = 0;
    let scoreCount = 0;

    allMetrics.forEach((metric) => {
      // Environmental
      platformMetrics.environmental.co2Reduced += metric.environmental?.co2Reduced || 0;
      platformMetrics.environmental.waterSaved += metric.environmental?.waterSaved || 0;
      platformMetrics.environmental.treesPlanted += metric.environmental?.treesPlanted || 0;

      // Social
      platformMetrics.social.jobsCreated += metric.social?.jobsCreated || 0;
      platformMetrics.social.familiesSupported += metric.social?.familiesSupported || 0;
      platformMetrics.social.peopleEducated += metric.social?.peopleEducated || 0;
      platformMetrics.social.communityInvestment += metric.social?.communityInvestment || 0;

      // Economic
      platformMetrics.economic.totalInvestment += metric.economic?.totalInvestment || 0;
      platformMetrics.economic.revenueGenerated += metric.economic?.revenueGenerated || 0;
      platformMetrics.economic.farmersIncome += metric.economic?.farmersIncome || 0;
      platformMetrics.economic.productsSold += metric.economic?.productsSold || 0;

      // Score
      if (metric.overallImpactScore) {
        scoreSum += metric.overallImpactScore;
        scoreCount++;
      }
    });

    if (scoreCount > 0) {
      platformMetrics.averageImpactScore = (scoreSum / scoreCount).toFixed(2);
    }

    return successResponse(res, platformMetrics, 'Platform metrics retrieved successfully');
  }),

  /**
   * Create or update metrics
   * POST /api/impact
   */
  createMetrics: asyncHandler(async (req, res) => {
    const { entityType, entityId, ...metricsData } = req.body;

    if (!['user', 'farm', 'investment', 'product', 'platform'].includes(entityType)) {
      return errorResponse(res, 'Invalid entity type', 400);
    }

    // Check if metrics already exist
    let metrics = await ImpactMetrics.findOne({ entityType, entityId });

    if (metrics) {
      // Update existing metrics
      Object.assign(metrics, metricsData);
      metrics.updatedAt = new Date();
    } else {
      // Create new metrics
      metrics = new ImpactMetrics({
        entityType,
        entityId,
        ...metricsData,
        period: {
          startDate: new Date(),
          endDate: new Date(),
          type: 'lifetime',
        },
      });
    }

    // Calculate overall impact score
    metrics.calculateOverallScore();

    await metrics.save();

    return successResponse(res, metrics, 'Metrics saved successfully', 201);
  }),

  /**
   * Calculate impact score for an entity
   * GET /api/impact/:entityType/:entityId/score
   */
  calculateImpactScore: asyncHandler(async (req, res) => {
    const { entityType, entityId } = req.params;

    const metrics = await ImpactMetrics.findOne({ entityType, entityId });

    if (!metrics) {
      return errorResponse(res, 'Metrics not found', 404);
    }

    metrics.calculateOverallScore();
    await metrics.save();

    return successResponse(res, {
      overallImpactScore: metrics.overallImpactScore,
      breakdown: {
        environmental: metrics._calculateEnvironmentalScore(),
        social: metrics._calculateSocialScore(),
        economic: metrics._calculateEconomicScore(),
      },
    }, 'Impact score calculated successfully');
  }),

  /**
   * Get top performers (highest impact scores)
   * GET /api/impact/leaderboard
   */
  getLeaderboard: asyncHandler(async (req, res) => {
    const { entityType = 'farm', limit = 10 } = req.query;

    const topMetrics = await ImpactMetrics.find({
      entityType,
      isPublic: true,
      overallImpactScore: { $gt: 0 },
    })
      .sort({ overallImpactScore: -1 })
      .limit(parseInt(limit))
      .populate(entityType === 'user' ? 'user' : 'farm')
      .lean();

    return successResponse(res, topMetrics, 'Leaderboard retrieved successfully');
  }),
};

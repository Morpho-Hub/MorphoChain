import { Farm, User, Investment } from '../models/index.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import plantationService from '../services/plantationService.js';
import morphoCoinService from '../services/morphoCoinService.js';

export const farmController = {
  /**
   * Get all farms with filters and pagination
   * GET /api/farms
   */
  getAllFarms: asyncHandler(async (req, res) => {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      cropType, 
      country,
      minInvestment,
      maxInvestment,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    const filter = {};
    
    if (status) filter.status = status;
    if (cropType) filter.cropType = cropType;
    if (country) filter['location.country'] = country;
    
    if (minInvestment || maxInvestment) {
      filter.investmentGoal = {};
      if (minInvestment) filter.investmentGoal.$gte = parseFloat(minInvestment);
      if (maxInvestment) filter.investmentGoal.$lte = parseFloat(maxInvestment);
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const [farms, total] = await Promise.all([
      Farm.find(filter)
        .populate('owner', 'firstName lastName profilePicture walletAddress')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Farm.countDocuments(filter)
    ]);

    return paginatedResponse(res, farms, page, limit, total, 'Farms retrieved successfully');
  }),

  /**
   * Get public farms (only active status)
   * GET /api/farms/public
   */
  getPublicFarms: asyncHandler(async (req, res) => {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const [farms, total] = await Promise.all([
      Farm.find({ status: 'active' })
        .populate('owner', 'firstName lastName profilePicture')
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Farm.countDocuments({ status: 'active' })
    ]);

    return paginatedResponse(res, farms, page, limit, total, 'Public farms retrieved successfully');
  }),

  /**
   * Get farm by ID
   * GET /api/farms/:id
   */
  getFarmById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const farm = await Farm.findById(id)
      .populate('owner', 'firstName lastName profilePicture email walletAddress farmerData')
      .lean();

    if (!farm) {
      return errorResponse(res, MESSAGES.FARM.NOT_FOUND, 404);
    }

    // Get investors count and list
    const investments = await Investment.find({ farm: id, status: { $in: ['confirmed', 'active'] } })
      .populate('investor', 'firstName lastName profilePicture')
      .lean();

    // Increment views (do it asynchronously, don't await)
    Farm.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();

    return successResponse(res, { 
      ...farm, 
      investments,
      investorsCount: investments.length 
    }, 'Farm retrieved successfully');
  }),

  /**
   * Create a new farm
   * POST /api/farms
   */
  createFarm: asyncHandler(async (req, res) => {
    const userId = req.userId;

    // Check if user is a farmer
    if (req.userRole !== 'farmer') {
      return errorResponse(res, MESSAGES.ROLE.FARMER_ONLY, 403);
    }

    const farmData = {
      ...req.body,
      owner: userId,
      ownerWallet: req.user.walletAddress,
      status: 'draft'
    };

    const farm = new Farm(farmData);
    await farm.save();

    // Update user's farmer data
    await User.findByIdAndUpdate(userId, {
      $inc: { 'farmerData.farmCount': 1 }
    });

    return successResponse(res, farm, MESSAGES.FARM.CREATED, 201);
  }),

  /**
   * Update farm
   * PUT /api/farms/:id
   */
  updateFarm: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    const farm = await Farm.findById(id);

    if (!farm) {
      return errorResponse(res, MESSAGES.FARM.NOT_FOUND, 404);
    }

    // Check ownership (unless admin)
    if (farm.owner.toString() !== userId.toString() && userRole !== 'admin') {
      return errorResponse(res, MESSAGES.FARM.NOT_OWNER, 403);
    }

    // Prevent updating certain fields
    const { tokenId, owner, ownerWallet, createdAt, ...updateData } = req.body;

    Object.assign(farm, updateData);
    farm.updatedAt = new Date();

    await farm.save();

    return successResponse(res, farm, MESSAGES.FARM.UPDATED);
  }),

  /**
   * Delete farm
   * DELETE /api/farms/:id
   */
  deleteFarm: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    const farm = await Farm.findById(id);

    if (!farm) {
      return errorResponse(res, MESSAGES.FARM.NOT_FOUND, 404);
    }

    // Check ownership (unless admin)
    if (farm.owner.toString() !== userId.toString() && userRole !== 'admin') {
      return errorResponse(res, MESSAGES.FARM.NOT_OWNER, 403);
    }

    // Check if farm has investments
    const investmentCount = await Investment.countDocuments({ farm: id });
    if (investmentCount > 0) {
      return errorResponse(res, 'Cannot delete farm with active investments', 400);
    }

    await farm.deleteOne();

    // Update user's farmer data
    await User.findByIdAndUpdate(farm.owner, {
      $inc: { 'farmerData.farmCount': -1 }
    });

    return successResponse(res, null, MESSAGES.FARM.DELETED);
  }),

  /**
   * Get farms by owner
   * GET /api/farms/owner/:userId
   */
  getFarmsByOwner: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [farms, total] = await Promise.all([
      Farm.find({ owner: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Farm.countDocuments({ owner: userId })
    ]);

    return paginatedResponse(res, farms, page, limit, total, 'Owner farms retrieved successfully');
  }),

  /**
   * Update farm tokenId (called by blockchain service)
   * PUT /api/farms/:id/tokenId
   */
  updateFarmTokenId: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { tokenId, contractAddress, transactionHash } = req.body;

    if (!tokenId) {
      return errorResponse(res, 'Token ID is required', 400);
    }

    const farm = await Farm.findById(id);

    if (!farm) {
      return errorResponse(res, MESSAGES.FARM.NOT_FOUND, 404);
    }

    farm.tokenId = tokenId;
    farm.contractAddress = contractAddress;
    farm.mintedAt = new Date();
    farm.status = 'active';

    await farm.save();

    return successResponse(res, farm, 'Farm tokenId updated successfully');
  }),

  /**
   * Update investment progress
   * PUT /api/farms/:id/investment
   */
  updateInvestmentProgress: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    const farm = await Farm.findById(id);

    if (!farm) {
      return errorResponse(res, MESSAGES.FARM.NOT_FOUND, 404);
    }

    farm.currentInvestment += parseFloat(amount);
    farm.investorsCount += 1;

    // Check if fully funded
    if (farm.currentInvestment >= farm.investmentGoal) {
      farm.status = 'funded';
    }

    await farm.save();

    return successResponse(res, farm, 'Investment progress updated');
  }),

  /**
   * Add harvest record
   * POST /api/farms/:id/harvest
   */
  addHarvest: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;

    const farm = await Farm.findById(id);

    if (!farm) {
      return errorResponse(res, MESSAGES.FARM.NOT_FOUND, 404);
    }

    // Check ownership
    if (farm.owner.toString() !== userId.toString()) {
      return errorResponse(res, MESSAGES.FARM.NOT_OWNER, 403);
    }

    const harvestData = {
      date: req.body.date || new Date(),
      quantity: req.body.quantity,
      quality: req.body.quality,
      revenue: req.body.revenue,
      notes: req.body.notes
    };

    farm.harvests.push(harvestData);
    await farm.save();

    return successResponse(res, farm, 'Harvest record added successfully');
  }),

  /**
   * Search farms
   * GET /api/farms/search
   */
  searchFarms: asyncHandler(async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return errorResponse(res, 'Search query is required', 400);
    }

    const skip = (page - 1) * limit;

    const searchQuery = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { cropType: { $regex: q, $options: 'i' } },
        { 'location.country': { $regex: q, $options: 'i' } },
        { 'location.region': { $regex: q, $options: 'i' } }
      ],
      status: 'active'
    };

    const [farms, total] = await Promise.all([
      Farm.find(searchQuery)
        .populate('owner', 'firstName lastName profilePicture')
        .sort({ views: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Farm.countDocuments(searchQuery)
    ]);

    return paginatedResponse(res, farms, page, limit, total, 'Search results');
  }),

  /**
   * Tokenize farm - creates tokens based on sustainability metrics
   * POST /api/farms/:id/tokenize
   */
  tokenizeFarm: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    const { 
      sustainabilityScore, 
      carbonScore, 
      soilHealth, 
      waterUsage, 
      biodiversity 
    } = req.body;

    const farm = await Farm.findById(id).populate('owner');

    if (!farm) {
      return errorResponse(res, MESSAGES.FARM.NOT_FOUND, 404);
    }

    // Check ownership
    if (farm.owner._id.toString() !== userId.toString()) {
      return errorResponse(res, MESSAGES.FARM.NOT_OWNER, 403);
    }

    // Check if already tokenized
    if (farm.tokenId) {
      return errorResponse(res, 'Farm already tokenized', 400);
    }

    // Check if user has wallet address
    if (!farm.owner.walletAddress) {
      return errorResponse(res, 'User must have a wallet address', 400);
    }

    try {
      // Calculate token amount based on sustainability metrics
      // Higher scores = more tokens
      const baseAmount = farm.size || 10; // Base on farm size
      const sustainabilityMultiplier = (
        (sustainabilityScore || 0) + 
        (carbonScore || 0) + 
        (soilHealth || 0) + 
        (100 - (waterUsage || 50)) + // Lower water usage is better
        (biodiversity || 0)
      ) / 500; // Average score out of 100 * 5 metrics

      const tokenAmount = baseAmount * Math.max(0.5, Math.min(2.0, sustainabilityMultiplier));

      // Register plantation in blockchain
      const plantationId = farm._id.toString();
      
      // Check if plantation already exists
      let existingPlantation;
      try {
        existingPlantation = await plantationService.getPlantationByWallet(farm.owner.walletAddress);
      } catch (error) {
        console.log('Plantation not found, will create new one');
      }

      if (!existingPlantation) {
        // Register new plantation
        await plantationService.registerPlantation(plantationId, farm.owner.walletAddress);
      }

      // Mint tokens to the plantation
      const mintResult = await plantationService.mintToPlantation(plantationId, tokenAmount);

      // Update farm with blockchain data
      farm.tokenId = plantationId;
      farm.status = 'active';
      farm.impactMetrics = {
        soilHealth,
        carbonScore,
        vegetationIndex: sustainabilityScore,
        waterUsage,
        biodiversity
      };
      farm.sustainabilityData = {
        sustainabilityScore,
        carbonScore,
        soilHealth,
        waterUsage,
        biodiversity,
        tokenAmount,
        mintedAt: new Date()
      };

      await farm.save();

      return successResponse(res, {
        farm,
        tokenAmount,
        transactionHash: mintResult.transactionHash,
        message: 'Farm successfully tokenized'
      }, 'Farm tokenized successfully', 201);

    } catch (error) {
      console.error('Tokenization error:', error);
      return errorResponse(res, `Tokenization failed: ${error.message}`, 500);
    }
  }),
};

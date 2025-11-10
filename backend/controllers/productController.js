import { Product, Farm, User } from '../models/index.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

export const productController = {
  /**
   * Get all products with filters
   * GET /api/products
   */
  getAllProducts: asyncHandler(async (req, res) => {
    const {
      page = 1,
      limit = 12,
      category,
      status,
      minPrice,
      maxPrice,
      isOrganic,
      isFairTrade,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = {};
    
    if (category) filter.category = category;
    if (status) filter.status = status;
    else filter.status = 'active'; // Default to active products only
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (isOrganic !== undefined) filter.isOrganic = isOrganic === 'true';
    if (isFairTrade !== undefined) filter.isFairTrade = isFairTrade === 'true';

    const skip = (page - 1) * limit;
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('seller', 'firstName lastName profilePicture walletAddress')
        .populate('farm', 'name location')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(filter)
    ]);

    return paginatedResponse(res, products, page, limit, total, 'Products retrieved successfully');
  }),

  /**
   * Get product by ID
   * GET /api/products/:id
   */
  getProductById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate('seller', 'firstName lastName profilePicture email walletAddress')
      .populate('farm', 'name location coverImage')
      .lean();

    if (!product) {
      return errorResponse(res, MESSAGES.PRODUCT.NOT_FOUND, 404);
    }

    // Increment views
    Product.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();

    return successResponse(res, product, 'Product retrieved successfully');
  }),

  /**
   * Create product
   * POST /api/products
   */
  createProduct: asyncHandler(async (req, res) => {
    const userId = req.userId;

    // Only farmers can create products
    if (req.userRole !== 'farmer') {
      return errorResponse(res, MESSAGES.ROLE.FARMER_ONLY, 403);
    }

    // If farm is provided, verify ownership
    if (req.body.farm) {
      const farm = await Farm.findById(req.body.farm);
      if (!farm) {
        return errorResponse(res, MESSAGES.FARM.NOT_FOUND, 404);
      }
      if (farm.owner.toString() !== userId.toString()) {
        return errorResponse(res, MESSAGES.FARM.NOT_OWNER, 403);
      }
      req.body.farmTokenId = farm.tokenId;
    }

    const productData = {
      ...req.body,
      seller: userId,
      sellerWallet: req.user.walletAddress,
      status: 'draft'
    };

    const product = new Product(productData);
    await product.save();

    return successResponse(res, product, MESSAGES.PRODUCT.CREATED, 201);
  }),

  /**
   * Update product
   * PUT /api/products/:id
   */
  updateProduct: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(res, MESSAGES.PRODUCT.NOT_FOUND, 404);
    }

    // Check ownership (unless admin)
    if (product.seller.toString() !== userId.toString() && userRole !== 'admin') {
      return errorResponse(res, 'You are not the seller of this product', 403);
    }

    // Prevent updating certain fields
    const { listingId, seller, sellerWallet, createdAt, ...updateData } = req.body;

    Object.assign(product, updateData);
    product.updatedAt = new Date();

    await product.save();

    return successResponse(res, product, MESSAGES.PRODUCT.UPDATED);
  }),

  /**
   * Delete product
   * DELETE /api/products/:id
   */
  deleteProduct: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.userId;
    const userRole = req.userRole;

    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(res, MESSAGES.PRODUCT.NOT_FOUND, 404);
    }

    // Check ownership (unless admin)
    if (product.seller.toString() !== userId.toString() && userRole !== 'admin') {
      return errorResponse(res, 'You are not the seller of this product', 403);
    }

    await product.deleteOne();

    return successResponse(res, null, MESSAGES.PRODUCT.DELETED);
  }),

  /**
   * Get products by seller
   * GET /api/products/seller/:userId
   */
  getProductsBySeller: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find({ seller: userId })
        .populate('farm', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments({ seller: userId })
    ]);

    return paginatedResponse(res, products, page, limit, total, 'Seller products retrieved successfully');
  }),

  /**
   * Get my products (authenticated user)
   * GET /api/products/my-products
   */
  getMyProducts: asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { page = 1, limit = 100 } = req.query;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find({ seller: userId })
        .populate('farm', 'name location')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments({ seller: userId })
    ]);

    return paginatedResponse(res, products, page, limit, total, 'My products retrieved successfully');
  }),

  /**
   * Get products by farm
   * GET /api/products/farm/:farmId
   */
  getProductsByFarm: asyncHandler(async (req, res) => {
    const { farmId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Build filter - include all statuses if user is authenticated and is the farm owner
    const filter = { farm: farmId };
    
    // If not authenticated or not the owner, only show active products
    if (!req.userId) {
      filter.status = 'active';
    } else {
      // Check if user is the farm owner
      const farm = await Farm.findById(farmId);
      if (farm && farm.owner.toString() !== req.userId.toString()) {
        filter.status = 'active';
      }
      // If user is the owner, don't filter by status (show all products)
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('seller', 'firstName lastName profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(filter)
    ]);

    return paginatedResponse(res, products, page, limit, total, 'Farm products retrieved successfully');
  }),

  /**
   * Update product listingId (called by blockchain service)
   * PUT /api/products/:id/listingId
   */
  updateProductListingId: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { listingId, contractAddress } = req.body;

    if (!listingId) {
      return errorResponse(res, 'Listing ID is required', 400);
    }

    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(res, MESSAGES.PRODUCT.NOT_FOUND, 404);
    }

    product.listingId = listingId;
    product.contractAddress = contractAddress;
    product.isListed = true;
    product.listedAt = new Date();
    product.status = 'active';

    await product.save();

    return successResponse(res, product, 'Product listingId updated successfully');
  }),

  /**
   * Reduce stock (called after purchase)
   * PUT /api/products/:id/stock
   */
  reduceStock: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return errorResponse(res, 'Valid quantity is required', 400);
    }

    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(res, MESSAGES.PRODUCT.NOT_FOUND, 404);
    }

    if (product.stock < quantity) {
      return errorResponse(res, MESSAGES.PRODUCT.INSUFFICIENT_STOCK, 400);
    }

    product.stock -= quantity;
    product.soldQuantity += quantity;

    if (product.stock === 0) {
      product.status = 'out-of-stock';
    }

    await product.save();

    return successResponse(res, product, 'Stock updated successfully');
  }),

  /**
   * Update product rating
   * POST /api/products/:id/rating
   */
  updateProductRating: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return errorResponse(res, 'Rating must be between 1 and 5', 400);
    }

    const product = await Product.findById(id);

    if (!product) {
      return errorResponse(res, MESSAGES.PRODUCT.NOT_FOUND, 404);
    }

    const totalRating = product.averageRating * product.reviewCount;
    product.reviewCount += 1;
    product.averageRating = (totalRating + rating) / product.reviewCount;

    await product.save();

    return successResponse(res, product, 'Rating updated successfully');
  }),

  /**
   * Search products
   * GET /api/products/search
   */
  searchProducts: asyncHandler(async (req, res) => {
    const { q, page = 1, limit = 12 } = req.query;

    if (!q) {
      return errorResponse(res, 'Search query is required', 400);
    }

    const skip = (page - 1) * limit;

    const searchQuery = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ],
      status: 'active'
    };

    const [products, total] = await Promise.all([
      Product.find(searchQuery)
        .populate('seller', 'firstName lastName profilePicture')
        .sort({ views: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Product.countDocuments(searchQuery)
    ]);

    return paginatedResponse(res, products, page, limit, total, 'Search results');
  }),

  /**
   * Get featured products
   * GET /api/products/featured
   */
  getFeaturedProducts: asyncHandler(async (req, res) => {
    const { limit = 6 } = req.query;

    const products = await Product.find({ 
      status: 'active', 
      isFeatured: true 
    })
      .populate('seller', 'firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    return successResponse(res, products, 'Featured products retrieved successfully');
  }),
};

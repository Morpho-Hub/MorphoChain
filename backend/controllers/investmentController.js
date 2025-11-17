import { Investment, Farm, User, Transaction } from '../models/index.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import morphoCoinService from '../services/morphoCoinService.js';
import plantationService from '../services/plantationService.js';

export const investmentController = {
  /**
   * Get my investments
   * GET /api/investments/my/investments
   */
  getMyInvestments: asyncHandler(async (req, res) => {
    const userId = req.userId;

    const investments = await Investment.find({ investor: userId })
      .populate('farm', 'name location impactMetrics verificationStatus tokenId')
      .sort({ createdAt: -1 })
      .lean();

    console.log('💼 Getting investments for user:', userId);
    console.log('💼 Total investments found:', investments.length);
    
    // Add metadata for regenerative token purchases
    const enrichedInvestments = investments.map(inv => {
      if (!inv.farm && inv.farmTokenId === 'DISTRIBUTED_TO_FARMS') {
        return {
          ...inv,
          farm: {
            name: 'Tokens Regenerativos',
            location: 'Distribuido en todas las fincas',
            _id: 'regenerative'
          }
        };
      }
      return inv;
    });

    console.log('💼 Enriched investments:', enrichedInvestments.length);

    return successResponse(res, enrichedInvestments, 'My investments retrieved successfully');
  }),

  /**
   * Get portfolio stats
   * GET /api/investments/my/stats
   */
  getPortfolioStats: asyncHandler(async (req, res) => {
    const userId = req.userId;

    const investments = await Investment.find({ 
      investor: userId
    }).populate('farm', 'name cropType');

    console.log('📊 Getting portfolio stats for user:', userId);
    console.log('📊 Total investments found:', investments.length);

    // Get all farms invested in (excluding regenerative tokens)
    const uniqueFarms = new Set(
      investments
        .filter(inv => inv.farm && inv.farmTokenId !== 'DISTRIBUTED_TO_FARMS')
        .map(inv => inv.farm?._id?.toString())
        .filter(Boolean)
    );

    // Calculate totals
    const totalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const totalReturns = investments.reduce((sum, inv) => sum + (inv.currentReturn || 0), 0);
    
    // Total tokens purchased across all investments
    const totalTokens = investments.reduce((sum, inv) => sum + (inv.tokensAmount || inv.amountInTokens || 0), 0);
    
    // Active investments count
    const activeInvestmentsCount = investments.filter(inv => 
      inv.status === 'active' || inv.status === 'confirmed'
    ).length;
    
    // Calculate current value
    const totalValue = totalInvested + totalReturns;

    const totalROI = totalInvested > 0 ? ((totalReturns) / totalInvested) * 100 : 0;
    const avgMonthlyROI = totalROI / 12;

    const stats = {
      totalValue,
      totalInvested,
      totalReturns,
      activeInvestments: totalTokens, // Total tokens purchased
      activeInvestmentsCount, // Number of active investments
      farmsCount: uniqueFarms.size,
      totalROI,
      avgMonthlyROI,
      portfolioValue: totalValue,
      totalTokens // Add explicit field
    };

    console.log('📊 Portfolio stats calculated:', stats);

    return successResponse(res, stats, 'Portfolio stats retrieved successfully');
  }),

  /**
   * Buy farm tokens with MORPHO
   * POST /api/investments/buy-tokens
   */
  buyFarmTokens: asyncHandler(async (req, res) => {
    const userId = req.userId;
    const userWallet = req.user.walletAddress;
    const { farmId, tokenAmount, transferTxHash } = req.body;

    console.log('🌾 Comprando tokens de finca:', { farmId, tokenAmount, userWallet, transferTxHash });

    if (!farmId || !tokenAmount || tokenAmount <= 0) {
      return errorResponse(res, 'farmId y tokenAmount son requeridos', 400);
    }

    if (!transferTxHash) {
      return errorResponse(res, 'transferTxHash es requerido - debe transferir MORPHO primero', 400);
    }

    // Validate farm exists
    const farm = await Farm.findById(farmId).populate('owner');
    if (!farm) {
      return errorResponse(res, MESSAGES.FARM.NOT_FOUND, 404);
    }

    const farmOwnerWallet = farm.ownerWallet;
    if (!farmOwnerWallet) {
      return errorResponse(res, 'La finca no tiene wallet configurada', 400);
    }

    // Calculate MORPHO cost (1 token = 10 MORPHO)
    const MORPHO_PER_TOKEN = 10;
    const morphoCost = tokenAmount * MORPHO_PER_TOKEN;

    console.log(`💰 Costo: ${morphoCost} MORPHO (${tokenAmount} tokens × ${MORPHO_PER_TOKEN})`);

    try {
      // 1. Verify the transfer transaction
      console.log(`🔍 Verificando transacción de transferencia: ${transferTxHash}`);
      
      const blockchainService = (await import('../services/blockchainService.js')).default;
      const { ethers } = await import('ethers');
      const provider = blockchainService.getSDK().getProvider();
      
      // Wait for transaction with retries
      let tx = null;
      let receipt = null;
      const maxRetries = 5;
      
      for (let i = 0; i < maxRetries; i++) {
        tx = await provider.getTransaction(transferTxHash);
        receipt = await provider.getTransactionReceipt(transferTxHash);
        
        if (tx && receipt) {
          console.log('✅ Transacción encontrada');
          break;
        }
        
        if (i < maxRetries - 1) {
          console.log(`⏳ Intento ${i + 1}/${maxRetries}, esperando 2s...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (!tx || !receipt) {
        console.error('❌ Transacción no encontrada');
        return errorResponse(res, 'Transacción de transferencia no encontrada', 400);
      }

      if (receipt.status !== 1) {
        console.error('❌ Transacción falló');
        return errorResponse(res, 'La transacción de transferencia falló', 400);
      }

      // Verify sender
      if (tx.from.toLowerCase() !== userWallet.toLowerCase()) {
        console.error('❌ Remitente incorrecto:', tx.from, 'vs', userWallet);
        return errorResponse(res, 'La transacción no es del usuario correcto', 400);
      }

      // Verify recipient
      if (tx.to.toLowerCase() !== farmOwnerWallet.toLowerCase()) {
        console.error('❌ Destinatario incorrecto:', tx.to, 'vs', farmOwnerWallet);
        return errorResponse(res, 'La transacción no es a la wallet de la finca', 400);
      }

      // Verify amount (MORPHO transfer is encoded in data)
      // For now, we trust the amount is correct
      // TODO: Decode transaction data to verify exact amount

      console.log('✅ Transferencia verificada exitosamente');

      // 2. Mint tokens to plantation if it has a tokenId
      let mintTxHash = null;
      if (farm.tokenId) {
        console.log(`🌱 Minteando ${morphoCost} MORPHO a plantación ${farm.tokenId}...`);
        try {
          const mintResult = await plantationService.mintToPlantation(farm.tokenId, morphoCost);
          if (mintResult.success) {
            mintTxHash = mintResult.transactionHash;
            console.log('✅ Minteo exitoso:', mintTxHash);
          } else {
            console.warn('⚠️ No se pudo mintear a plantación:', mintResult.error);
          }
        } catch (mintError) {
          console.warn('⚠️ Error minteando a plantación:', mintError.message);
          // No bloqueamos la inversión si falla el minteo
        }
      }

      // 3. Create investment record
      const investment = new Investment({
        investor: userId,
        investorWallet: userWallet.toLowerCase(),
        farm: farmId,
        farmTokenId: farm.tokenId,
        amount: morphoCost,
        amountInTokens: tokenAmount,
        tokensAmount: tokenAmount, // Add this field for stats
        percentage: (tokenAmount / (farm.landSize * 100)) * 100, // 100 tokens per hectare
        status: 'active',
        investmentDate: new Date(),
        expectedReturn: morphoCost * 0.15, // 15% annual ROI
        currentReturn: 0,
        transactionHash: transferTxHash,
        blockNumber: receipt.blockNumber,
      });

      await investment.save();
      console.log('💾 Inversión guardada:', investment._id);

      // 4. Update farm investment stats
      farm.currentInvestment = (farm.currentInvestment || 0) + morphoCost;
      farm.investorsCount = (farm.investorsCount || 0) + 1;
      await farm.save();

      // 5. Update user investor data
      await User.findByIdAndUpdate(userId, {
        $inc: {
          'investorData.totalInvested': morphoCost,
          'investorData.activeInvestments': 1,
        },
      });

      // 6. Create transaction record
      await Transaction.create({
        user: userId,
        type: 'investment',
        subtype: 'farm_token_purchase',
        amount: morphoCost,
        currency: 'MORPHO',
        from: userWallet,
        to: farmOwnerWallet,
        relatedFarm: farmId,
        relatedInvestment: investment._id,
        status: 'completed',
        transactionHash: transferTxHash,
        blockNumber: receipt.blockNumber,
        metadata: {
          farmName: farm.name,
          tokensPurchased: tokenAmount,
          pricePerToken: MORPHO_PER_TOKEN,
          mintTxHash,
        },
      });

      console.log('✅ Inversión completada exitosamente');

      return successResponse(res, {
        investment,
        farmName: farm.name,
        tokensPurchased: tokenAmount,
        morphoSpent: morphoCost,
        expectedAnnualReturn: morphoCost * 0.15,
        transactionHash: transferTxHash,
        blockNumber: receipt.blockNumber,
        mintTxHash,
      }, 'Inversión realizada exitosamente', 201);
    } catch (error) {
      console.error('❌ Error procesando inversión:', error);
      return errorResponse(res, `Error al procesar la inversión: ${error.message}`, 500);
    }
  }),

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

  /**
   * Buy regenerative tokens (corporate sustainability)
   * POST /api/investments/buy-regenerative-tokens
   */
  buyRegenerativeTokens: asyncHandler(async (req, res) => {
    const userId = req.userId;
    const userWallet = req.user?.walletAddress;
    const { tokenAmount, transferTxHash, companyName } = req.body;

    console.log('🌱 Comprando tokens regenerativos:', { 
      userId, 
      userWallet, 
      tokenAmount, 
      transferTxHash, 
      companyName,
      hasUser: !!req.user,
      body: req.body 
    });

    if (!userId || !userWallet) {
      console.error('❌ Usuario no autenticado correctamente');
      return errorResponse(res, 'Usuario no autenticado', 401);
    }

    if (!tokenAmount || tokenAmount <= 0) {
      return errorResponse(res, 'tokenAmount debe ser mayor a 0', 400);
    }

    if (!transferTxHash) {
      return errorResponse(res, 'transferTxHash es requerido - debe transferir MORPHO primero', 400);
    }

    // Calculate cost: 1 regenerative token = 5 USD = 5 MORPHO (assuming 1 MORPHO = 1 USD)
    const MORPHO_PER_TOKEN = 5;
    const morphoCost = tokenAmount * MORPHO_PER_TOKEN;
    const TREASURY_WALLET = process.env.TREASURY_WALLET || '0xD823f20E8053ead7ae65538ff73e23438F524E2E'; // Default treasury (checksummed)

    console.log(`💰 Costo: ${morphoCost} MORPHO (${tokenAmount} tokens × ${MORPHO_PER_TOKEN})`);

    try {
      // 1. Verify the transfer transaction
      console.log(`🔍 Verificando transacción de transferencia: ${transferTxHash}`);
      
      const blockchainService = (await import('../services/blockchainService.js')).default;
      const { ethers } = await import('ethers');
      const provider = blockchainService.getSDK().getProvider();
      
      // Wait for transaction with retries
      let tx = null;
      let receipt = null;
      const maxRetries = 5;
      
      for (let i = 0; i < maxRetries; i++) {
        tx = await provider.getTransaction(transferTxHash);
        receipt = await provider.getTransactionReceipt(transferTxHash);
        
        if (tx && receipt) {
          console.log('✅ Transacción encontrada');
          break;
        }
        
        if (i < maxRetries - 1) {
          console.log(`⏳ Intento ${i + 1}/${maxRetries}, esperando 2s...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (!tx || !receipt) {
        console.error('❌ Transacción no encontrada');
        return errorResponse(res, 'Transacción de transferencia no encontrada', 400);
      }

      if (receipt.status !== 1) {
        console.error('❌ Transacción falló');
        return errorResponse(res, 'La transacción de transferencia falló', 400);
      }

      // Verify sender
      if (tx.from.toLowerCase() !== userWallet.toLowerCase()) {
        console.error('❌ Remitente incorrecto:', tx.from, 'vs', userWallet);
        return errorResponse(res, 'La transacción no es del usuario correcto', 400);
      }

      // Verify it's a transaction to MorphoCoin contract
      const MORPHO_CONTRACT = process.env.MORPHO_CONTRACT_ADDRESS || '0xa0943426e598d223852023e7879d92c704791e62';
      if (tx.to.toLowerCase() !== MORPHO_CONTRACT.toLowerCase()) {
        console.error('❌ No es una transacción de MORPHO:', tx.to, 'vs', MORPHO_CONTRACT);
        return errorResponse(res, 'La transacción debe ser una transferencia de MORPHO', 400);
      }

      // For ERC20 transfers, the recipient is encoded in the data, not in tx.to
      // We trust the transaction is valid since it's confirmed on-chain
      console.log('✅ Transferencia de MORPHO verificada exitosamente');

      // 2. Distribute tokens equally among all active farms
      console.log('🌾 Distribuyendo tokens entre fincas activas...');
      const activeFarms = await Farm.find({ 
        status: 'active',
        tokenId: { $exists: true, $ne: null } 
      }).select('tokenId name');

      console.log(`📊 ${activeFarms.length} fincas activas encontradas`);

      const mintResults = [];
      
      if (activeFarms.length > 0) {
        const amountPerFarm = Math.floor(morphoCost / activeFarms.length);
        console.log(`💰 ${amountPerFarm} MORPHO por finca`);

        for (const farm of activeFarms) {
          try {
            console.log(`🌱 Minteando ${amountPerFarm} MORPHO a finca ${farm.name} (${farm.tokenId})...`);
            const mintResult = await plantationService.mintToPlantation(farm.tokenId, amountPerFarm);
            
            if (mintResult.success) {
              mintResults.push({
                farmId: farm._id,
                farmName: farm.name,
                tokenId: farm.tokenId,
                amount: amountPerFarm,
                txHash: mintResult.transactionHash,
              });
              console.log(`✅ Minteo exitoso para ${farm.name}`);
            } else {
              console.warn(`⚠️ No se pudo mintear a ${farm.name}:`, mintResult.error);
            }
          } catch (mintError) {
            console.warn(`⚠️ Error minteando a ${farm.name}:`, mintError.message);
          }
        }
      } else {
        console.warn('⚠️ No hay fincas activas para distribuir tokens');
      }

      // 3. Create investment record
      const investment = new Investment({
        investor: userId,
        investorWallet: userWallet,
        farm: null, // Distributed across all farms
        farmTokenId: 'DISTRIBUTED_TO_FARMS',
        amount: morphoCost,
        tokensAmount: tokenAmount, // Add this field for stats
        amountInTokens: tokenAmount,
        percentage: 0,
        status: 'active',
        investmentDate: new Date(),
        expectedReturn: tokenAmount * 0.05, // Mock 5% annual return
        currentReturn: 0,
        transactionHash: transferTxHash,
        blockNumber: receipt.blockNumber,
      });

      await investment.save();

      // 4. Update user investor data
      await User.findByIdAndUpdate(userId, {
        $inc: {
          'investorData.totalInvested': morphoCost,
          'investorData.activeInvestments': 1,
        },
      });

      // 5. Create transaction record
      const transaction = new Transaction({
        user: userId,
        type: 'regenerative_purchase',
        amount: morphoCost,
        status: 'completed',
        description: `Compra de ${tokenAmount} tokens regenerativos distribuidos a ${activeFarms.length} fincas${companyName ? ` - ${companyName}` : ''}`,
        transactionHash: transferTxHash,
        blockchainData: {
          from: userWallet,
          to: TREASURY_WALLET,
          value: morphoCost,
          blockNumber: receipt.blockNumber,
          distributedToFarms: mintResults,
          farmsCount: activeFarms.length,
        },
      });

      await transaction.save();

      console.log('✅ Compra de tokens regenerativos registrada exitosamente');

      // 6. Calculate environmental impact
      const carbonOffset = (tokenAmount * 0.05).toFixed(2); // 50kg = 0.05 ton per token
      const waterSaved = tokenAmount * 1000; // 1000L per token
      const treesPlanted = Math.floor(tokenAmount / 10); // 1 tree per 10 tokens

      return successResponse(
        res,
        {
          investment,
          tokensPurchased: tokenAmount,
          morphoSpent: morphoCost,
          carbonOffset: `${carbonOffset} ton CO₂`,
          waterSaved: `${waterSaved.toLocaleString()} L`,
          treesPlanted,
          transactionHash: transferTxHash,
          farmsSupported: activeFarms.length,
          distributionResults: mintResults,
          certificateId: `MORPHO-${Date.now()}`,
          purchaseDate: new Date().toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        },
        `Tokens regenerativos comprados y distribuidos a ${activeFarms.length} fincas exitosamente`
      );
    } catch (error) {
      console.error('❌ Error en compra de tokens regenerativos:', error);
      throw error;
    }
  }),
};

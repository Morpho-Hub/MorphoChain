import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import routes
import authRoutes from './routes/authRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import investmentRoutes from './routes/investmentRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import impactRoutes from './routes/impactRoutes.js';
import blockchainRoutes from './routes/blockchainRoutes.js';

// Import error handler
import { errorHandler } from './middlewares/errorHandler.js';

// Import blockchain service
import blockchainService from './services/blockchainService.js';

dotenv.config();

// Environment variables
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/morphochain';
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const app = express();

// ============ MIDDLEWARES ============

// Security
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ============ ROUTES ============

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'MorphoChain API is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/blockchain', blockchainRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global error handler
app.use(errorHandler);

// ============ DATABASE CONNECTION ============

// Initialize services and start server
async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, { 
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${MONGO_URI}`);
    
    // Initialize Blockchain Service
    try {
      console.log('🔄 Initializing blockchain service...');
      await blockchainService.initialize();
      console.log('✅ Blockchain service initialized');
    } catch (error) {
      console.error('❌ ERROR: Blockchain service failed to initialize');
      console.error('   This is non-blocking. Check your .env configuration.');
      console.error(`   Error: ${error.message}`);
      console.error('   Full error:', error);
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⛓️  Chain ID: ${process.env.CHAIN_ID || '11155111'} (Sepolia)`);
    });
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
}

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

export default app;


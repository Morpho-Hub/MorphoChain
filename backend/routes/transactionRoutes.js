import express from 'express';
import { transactionController } from '../controllers/transactionController.js';
import { authenticate } from '../middlewares/index.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get transactions
router.get('/:id', transactionController.getTransactionById);
router.get('/hash/:hash', transactionController.getTransactionByHash);
router.get('/user/:userId', transactionController.getTransactionsByUser);
router.get('/user/:userId/summary', transactionController.getTransactionSummary);
router.get('/wallet/:address', transactionController.getTransactionsByWallet);

// Internal routes (called by blockchain service)
router.post('/', transactionController.createTransaction);
router.put('/:id/status', transactionController.updateTransactionStatus);

export default router;

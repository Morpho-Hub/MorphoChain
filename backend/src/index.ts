import express from 'express';
import userRouter from './routes/users';
import authRouter from './routes/authRoutes';

const router = express.Router();

// auth
router.use('/auth', authRouter);

// users
router.use('/users', userRouter);

export default router;
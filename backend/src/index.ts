import express from 'express';
import userRouter from './routes/users';
import authRouter from './routes/authRoutes';
import fincaRoutes from './routes/fincas';
import cropRoutes from './routes/crops';
import tokenRoutes from './routes/tokens';

const router = express.Router();

// auth
router.use('/auth', authRouter);

// users
router.use('/users', userRouter);
router.use('/fincas', fincaRoutes);
router.use('/crops', cropRoutes);
router.use('/tokens', tokenRoutes);

export default router;
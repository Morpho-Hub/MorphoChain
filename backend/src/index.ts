import express from 'express';
import userRouter from './routes/users';
import fincaRoutes from './routes/fincas';
import cropRoutes from './routes/crops';
import tokenRoutes from './routes/tokens';

const router = express.Router();

router.use('/users', userRouter);
router.use('/fincas', fincaRoutes);
router.use('/crops', cropRoutes);
router.use('/tokens', tokenRoutes);

export default router;
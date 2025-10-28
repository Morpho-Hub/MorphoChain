import express from 'express';
import { login, register, verifyToken } from '../controllers/authController';

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuario con wallet address
 * @access  Public
 * @body    { walletAddress: string }
 */
router.post('/login', login);

/**
 * @route   POST /api/auth/register
 * @desc    Registro de nuevo usuario
 * @access  Public
 * @body    { firstName, lastName, email, walletAddress, userType }
 */
router.post('/register', register);

/**
 * @route   GET /api/auth/verify
 * @desc    Verificar token JWT y obtener datos del usuario
 * @access  Public (pero requiere token en header Authorization)
 * @header  Authorization: Bearer <token>
 */
router.get('/verify', verifyToken);

export default router;

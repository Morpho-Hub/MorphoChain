import { Request, Response } from 'express';
import { User, IUser } from '../models/user';
import { AuthService } from '../services/authService';

export enum AuthResponseCode {
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  REGISTRATION_REQUIRED = 'REGISTRATION_REQUIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

interface LoginRequest {
  walletAddress: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  walletAddress: string;
  userType: 'inversionista' | 'agricultor';
}

interface AuthResponse<T = any> {
  success: boolean;
  message?: string;
  code?: AuthResponseCode;
  data?: T;
  token?: string;
  user?: Partial<IUser>;
  error?: string;
}

/**
 * Login de usuario existente con wallet address
 * POST /api/auth/login
 */
export const login = async (
  req: Request<{}, {}, LoginRequest>,
  res: Response<AuthResponse>
): Promise<void> => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      res.status(400).json({
        success: false,
        code: AuthResponseCode.VALIDATION_ERROR,
        message: 'Wallet address is required',
      });
      return;
    }

    const user = await User.findOne({
      walletAddress: walletAddress.toLowerCase().trim(),
    });

    if (!user) {
      res.status(404).json({
        success: false,
        code: AuthResponseCode.REGISTRATION_REQUIRED,
        message: 'User not found. Please register first.',
      });
      return;
    }

    // Aqui genero token JWT
    const token = AuthService.generateToken(user);

    // Enviar respuesta exitosa
    res.status(200).json({
      success: true,
      code: AuthResponseCode.AUTH_SUCCESS,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        walletAddress: user.walletAddress,
        userType: user.userType,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: err.message,
    });
  }
};

/**
 * Registro de nuevo usuario
 * POST /api/auth/register
 */
export const register = async (
  req: Request<{}, {}, RegisterRequest>,
  res: Response<AuthResponse>
): Promise<void> => {
  try {
    const { firstName, lastName, email, walletAddress, userType } = req.body;

    if (!firstName || !lastName || !email || !walletAddress || !userType) {
      res.status(400).json({
        success: false,
        code: AuthResponseCode.VALIDATION_ERROR,
        message: 'All fields are required: firstName, lastName, email, walletAddress, userType',
      });
      return;
    }

    if (userType !== 'inversionista' && userType !== 'agricultor') {
      res.status(400).json({
        success: false,
        code: AuthResponseCode.VALIDATION_ERROR,
        message: 'Invalid userType. Must be "inversionista" or "agricultor"',
      });
      return;
    }

    const existingUser = await User.findOne({
      $or: [
        { walletAddress: walletAddress.toLowerCase().trim() },
        { email: email.toLowerCase().trim() },
      ],
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        code: AuthResponseCode.USER_ALREADY_EXISTS,
        message: 'User with this wallet address or email already exists',
      });
      return;
    }

    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      walletAddress: walletAddress.toLowerCase().trim(),
      userType,
    });

    const savedUser = await newUser.save();

    const token = AuthService.generateToken(savedUser);

    res.status(201).json({
      success: true,
      code: AuthResponseCode.AUTH_SUCCESS,
      message: 'User registered successfully',
      token,
      user: {
        _id: savedUser._id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        walletAddress: savedUser.walletAddress,
        userType: savedUser.userType,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: err.message,
    });
  }
};

/**
 * Verificar token JWT y obtener datos del usuario
 * GET /api/auth/verify
 */
export const verifyToken = async (
  req: Request,
  res: Response<AuthResponse>
): Promise<void> => {
  try {
    // Extraer token del header
    const token = AuthService.extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({
        success: false,
        code: AuthResponseCode.INVALID_TOKEN,
        message: 'No token provided',
      });
      return;
    }

    const payload = AuthService.verifyToken(token);

    if (!payload) {
      res.status(401).json({
        success: false,
        code: AuthResponseCode.INVALID_TOKEN,
        message: 'Invalid or expired token',
      });
      return;
    }

    const user = await User.findOne({
      walletAddress: payload.walletAddress.toLowerCase(),
    });

    if (!user) {
      res.status(404).json({
        success: false,
        code: AuthResponseCode.USER_NOT_FOUND,
        message: 'User not found',
      });
      return;
    }

    // Enviar datos del usuario
    res.status(200).json({
      success: true,
      code: AuthResponseCode.AUTH_SUCCESS,
      message: 'Token is valid',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        walletAddress: user.walletAddress,
        userType: user.userType,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: 'Error verifying token',
      error: err.message,
    });
  }
};

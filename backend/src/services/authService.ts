import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../models/user';

// Payload del JWT
export interface JWTPayload {
  userId: string;
  walletAddress: string;
  userType: 'inversionista' | 'agricultor';
}

export class AuthService {
  /**
   * Genera un token JWT para el usuario
   * @param user - Usuario autenticado
   * @returns Token JWT
   */
  static generateToken(user: IUser): string {
    const payload: JWTPayload = {
      userId: user._id.toString(),
      walletAddress: user.walletAddress,
      userType: user.userType,
    };

    const secret = process.env.JWT_SECRET || 'morphochain-secret-key-2024';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    return jwt.sign(payload, secret, { expiresIn } as any);
  }

  /**
   * Verifica y decodifica un token JWT
   * @param token - Token JWT a verificar
   * @returns Payload del token o null si es inválido
   */
  static verifyToken(token: string): JWTPayload | null {
    try {
      const secret = process.env.JWT_SECRET || 'morphochain-secret-key-2024';
      const decoded = jwt.verify(token, secret) as JWTPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  /**
   * Extrae el token del header Authorization
   * @param authHeader - Header Authorization del request
   * @returns Token sin el prefijo "Bearer" o null
   */
  static extractTokenFromHeader(authHeader?: string): string | null {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }
}

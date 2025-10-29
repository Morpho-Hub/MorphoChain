import { Request, Response } from 'express';
import { TokenService } from '../services/tokenService';

export class TokenController {
  static async createToken(req: Request, res: Response) {
    try {
      const token = await TokenService.createToken(req.body);
      res.status(201).json({
        success: true,
        data: token
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getToken(req: Request, res: Response) {
    try {
      const token = await TokenService.getTokenById(req.params.id);
      if (!token) {
        return res.status(404).json({
          success: false,
          message: 'Token not found'
        });
      }
      res.status(200).json({
        success: true,
        data: token
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getTokenByBlockchainId(req: Request, res: Response) {
    try {
      const token = await TokenService.getTokenByBlockchainId(req.params.tokenIdBlockchain);
      if (!token) {
        return res.status(404).json({
          success: false,
          message: 'Token not found'
        });
      }
      res.status(200).json({
        success: true,
        data: token
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getAllTokens(req: Request, res: Response) {
    try {
      const tokens = await TokenService.getAllTokens();
      res.status(200).json({
        success: true,
        data: tokens,
        count: tokens.length
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getTokensByFinca(req: Request, res: Response) {
    try {
      const tokens = await TokenService.getTokensByFinca(req.params.fincaId);
      res.status(200).json({
        success: true,
        data: tokens,
        count: tokens.length
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getTokensByOwner(req: Request, res: Response) {
    try {
      const tokens = await TokenService.getTokensByOwner(req.params.ownerId);
      res.status(200).json({
        success: true,
        data: tokens,
        count: tokens.length
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateToken(req: Request, res: Response) {
    try {
      const token = await TokenService.updateToken(req.params.id, req.body);
      if (!token) {
        return res.status(404).json({
          success: false,
          message: 'Token not found'
        });
      }
      res.status(200).json({
        success: true,
        data: token
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteToken(req: Request, res: Response) {
    try {
      const token = await TokenService.deleteToken(req.params.id);
      if (!token) {
        return res.status(404).json({
          success: false,
          message: 'Token not found'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Token deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async addTransfer(req: Request, res: Response) {
    try {
      const token = await TokenService.addTransferToHistory(req.params.id, req.body);
      if (!token) {
        return res.status(404).json({
          success: false,
          message: 'Token not found'
        });
      }
      res.status(200).json({
        success: true,
        data: token
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateTokenStatus(req: Request, res: Response) {
    try {
      const token = await TokenService.updateTokenStatus(req.params.id, req.body.status);
      if (!token) {
        return res.status(404).json({
          success: false,
          message: 'Token not found'
        });
      }
      res.status(200).json({
        success: true,
        data: token
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}
import { Request, Response } from 'express';
import { FincaService } from '../services/fincaService';

export class FincaController {
  static async createFinca(req: Request, res: Response) {
    try {
      const finca = await FincaService.createFinca(req.body);
      res.status(201).json({
        success: true,
        data: finca
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getFinca(req: Request, res: Response) {
    try {
      const finca = await FincaService.getFincaById(req.params.id);
      if (!finca) {
        return res.status(404).json({
          success: false,
          message: 'Finca not found'
        });
      }
      res.status(200).json({
        success: true,
        data: finca
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getAllFincas(req: Request, res: Response) {
    try {
      const fincas = await FincaService.getAllFincas();
      res.status(200).json({
        success: true,
        data: fincas,
        count: fincas.length
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getFincasByOwner(req: Request, res: Response) {
    try {
      const fincas = await FincaService.getFincasByOwner(req.params.ownerId);
      res.status(200).json({
        success: true,
        data: fincas,
        count: fincas.length
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateFinca(req: Request, res: Response) {
    try {
      const finca = await FincaService.updateFinca(req.params.id, req.body);
      if (!finca) {
        return res.status(404).json({
          success: false,
          message: 'Finca not found'
        });
      }
      res.status(200).json({
        success: true,
        data: finca
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteFinca(req: Request, res: Response) {
    try {
      const finca = await FincaService.deleteFinca(req.params.id);
      if (!finca) {
        return res.status(404).json({
          success: false,
          message: 'Finca not found'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Finca deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async addCrop(req: Request, res: Response) {
    try {
      const finca = await FincaService.addCropToFinca(req.params.id, req.body.cropId);
      if (!finca) {
        return res.status(404).json({
          success: false,
          message: 'Finca not found'
        });
      }
      res.status(200).json({
        success: true,
        data: finca
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async addToken(req: Request, res: Response) {
    try {
      const finca = await FincaService.addTokenToFinca(req.params.id, req.body.tokenId);
      if (!finca) {
        return res.status(404).json({
          success: false,
          message: 'Finca not found'
        });
      }
      res.status(200).json({
        success: true,
        data: finca
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}
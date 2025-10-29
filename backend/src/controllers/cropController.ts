import { Request, Response } from 'express';
import { CropService } from '../services/cropService';

export class CropController {
  static async createCrop(req: Request, res: Response) {
    try {
      const crop = await CropService.createCrop(req.body);
      res.status(201).json({
        success: true,
        data: crop
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getCrop(req: Request, res: Response) {
    try {
      const crop = await CropService.getCropById(req.params.id);
      if (!crop) {
        return res.status(404).json({
          success: false,
          message: 'Crop not found'
        });
      }
      res.status(200).json({
        success: true,
        data: crop
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getAllCrops(req: Request, res: Response) {
    try {
      const crops = await CropService.getAllCrops();
      res.status(200).json({
        success: true,
        data: crops,
        count: crops.length
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getCropsByFinca(req: Request, res: Response) {
    try {
      const crops = await CropService.getCropsByFinca(req.params.fincaId);
      res.status(200).json({
        success: true,
        data: crops,
        count: crops.length
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateCrop(req: Request, res: Response) {
    try {
      const crop = await CropService.updateCrop(req.params.id, req.body);
      if (!crop) {
        return res.status(404).json({
          success: false,
          message: 'Crop not found'
        });
      }
      res.status(200).json({
        success: true,
        data: crop
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async deleteCrop(req: Request, res: Response) {
    try {
      const crop = await CropService.deleteCrop(req.params.id);
      if (!crop) {
        return res.status(404).json({
          success: false,
          message: 'Crop not found'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Crop deleted successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async updateCropStatus(req: Request, res: Response) {
    try {
      const crop = await CropService.updateCropStatus(req.params.id, req.body.status);
      if (!crop) {
        return res.status(404).json({
          success: false,
          message: 'Crop not found'
        });
      }
      res.status(200).json({
        success: true,
        data: crop
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}
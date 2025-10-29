import { Crop, ICrop } from '../models/crop';

export class CropService {
  static async createCrop(cropData: Partial<ICrop>): Promise<ICrop> {
    const crop = new Crop(cropData);
    return await crop.save();
  }

  static async getCropById(id: string): Promise<ICrop | null> {
    return await Crop.findById(id).populate('fincaId');
  }

  static async getAllCrops(): Promise<ICrop[]> {
    return await Crop.find().populate('fincaId').sort({ createdAt: -1 });
  }

  static async getCropsByFinca(fincaId: string): Promise<ICrop[]> {
    return await Crop.find({ fincaId }).populate('fincaId').sort({ createdAt: -1 });
  }

  static async updateCrop(id: string, updateData: Partial<ICrop>): Promise<ICrop | null> {
    return await Crop.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('fincaId');
  }

  static async deleteCrop(id: string): Promise<ICrop | null> {
    return await Crop.findByIdAndDelete(id);
  }

  static async updateCropStatus(id: string, status: string): Promise<ICrop | null> {
    return await Crop.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('fincaId');
  }
}
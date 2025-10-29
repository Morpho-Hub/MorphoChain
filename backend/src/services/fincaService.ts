import { Finca, IFinca } from '../models/finca';

export class FincaService {
  static async createFinca(fincaData: Partial<IFinca>): Promise<IFinca> {
    const finca = new Finca(fincaData);
    return await finca.save();
  }

  static async getFincaById(id: string): Promise<IFinca | null> {
    return await Finca.findById(id)
      .populate('crops')
      .populate('tokens')
      .populate('owner');
  }

  static async getAllFincas(): Promise<IFinca[]> {
    return await Finca.find()
      .populate('crops')
      .populate('tokens')
      .populate('owner')
      .sort({ createdAt: -1 });
  }

  static async getFincasByOwner(ownerId: string): Promise<IFinca[]> {
    return await Finca.find({ owner: ownerId })
      .populate('crops')
      .populate('tokens')
      .sort({ createdAt: -1 });
  }

  static async updateFinca(id: string, updateData: Partial<IFinca>): Promise<IFinca | null> {
    return await Finca.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    )
    .populate('crops')
    .populate('tokens')
    .populate('owner');
  }

  static async deleteFinca(id: string): Promise<IFinca | null> {
    return await Finca.findByIdAndDelete(id);
  }

  static async addCropToFinca(fincaId: string, cropId: string): Promise<IFinca | null> {
    return await Finca.findByIdAndUpdate(
      fincaId,
      { $push: { crops: cropId } },
      { new: true }
    );
  }

  static async addTokenToFinca(fincaId: string, tokenId: string): Promise<IFinca | null> {
    return await Finca.findByIdAndUpdate(
      fincaId,
      { $push: { tokens: tokenId } },
      { new: true }
    );
  }
}
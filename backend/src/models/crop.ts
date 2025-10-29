import mongoose, { Document, Schema } from 'mongoose';

export interface ICrop extends Document {
  fincaId: mongoose.Types.ObjectId;
  type: string;
  areaHectares: number;
  annualYield: number;
  plantingDate: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const CropSchema: Schema = new Schema({
  fincaId: { type: Schema.Types.ObjectId, ref: 'Finca', required: true },
  type: { type: String, required: true, trim: true },
  areaHectares: { type: Number, required: true },
  annualYield: { type: Number, default: 0 },
  plantingDate: { type: Date },
  status: { type: String, default: 'En crecimiento', trim: true }
}, { 
  timestamps: true, 
  versionKey: 'version' 
});

export const Crop = mongoose.model<ICrop>('Crop', CropSchema);

import mongoose, { Document, Schema } from 'mongoose';

export interface IFinca extends Document {
  name: string;
  description: string;
  owner: mongoose.Types.ObjectId;
  image: string;
  location: {
    country: string;
    province: string;
    coordinates: { lat: number; lng: number };
  };
  hectares: number;
  totalFunding: number;
  pricePerToken: number;
  metrics: {
    S: { organicMatter: number; pHLevel: number };
    C: { tonsPerYear: number; perHectare: number };
    V: { NDVI: number; coverage: number };
    A: number;
  };
  crops: mongoose.Types.ObjectId[];
  tokens: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const FincaSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, trim: true },
  location: {
    country: { type: String, trim: true },
    province: { type: String, trim: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  hectares: { type: Number, required: true },
  totalFunding: { type: Number, default: 0 },
  pricePerToken: { type: Number, required: true },
  metrics: {
    S: {
      organicMatter: { type: Number, default: 0 },
      pHLevel: { type: Number, default: 7 } 
    },
    C: {
      tonsPerYear: { type: Number, default: 0 },
      perHectare: { type: Number, default: 0 }
    },
    V: {
      NDVI: { type: Number, default: 0 },
      coverage: { type: Number, default: 0 } 
    },
    A: { type: Number, default: 0 } 
  },
  crops: [{ type: Schema.Types.ObjectId, ref: 'Crop' }],
  tokens: [{ type: Schema.Types.ObjectId, ref: 'Token' }]
}, { 
  timestamps: true, 
  versionKey: 'version' 
});

export const Finca = mongoose.model<IFinca>('Finca', FincaSchema);

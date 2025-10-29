import mongoose, { Document, Schema } from 'mongoose';

export interface IToken extends Document {
  tokenIdBlockchain: string;
  fincaId: mongoose.Types.ObjectId;
  ownerId: mongoose.Types.ObjectId;
  tokenValue: number;
  status: string;
  issuedAt: Date;
  transferHistory: {
    from: string;
    to: string;
    date: Date;
    price: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const TokenSchema: Schema = new Schema({
  tokenIdBlockchain: { type: String, required: true, trim: true },
  fincaId: { type: Schema.Types.ObjectId, ref: 'Finca', required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tokenValue: { type: Number, default: 0 },
  status: { type: String, default: 'active', trim: true },
  issuedAt: { type: Date, default: Date.now },
  transferHistory: [{
    from: { type: String, trim: true },
    to: { type: String, trim: true },
    date: { type: Date },
    price: { type: Number }
  }]
}, { 
  timestamps: true, 
  versionKey: 'version' 
});

export const Token = mongoose.model<IToken>('Token', TokenSchema);

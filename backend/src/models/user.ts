import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  walletAddress: string;
  userType: 'inversionista' | 'agricultor';
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

const UserSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  walletAddress: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  userType: {
    type: String,
    required: true,
    enum: ['inversionista', 'agricultor'],
    trim: true
  },
}, {
  timestamps: true,
  versionKey: 'version'
});

UserSchema.index({ walletAddress: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ userType: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  walletAddress: string;
  userType: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  walletAddress: { type: String, required: true, trim: true },
  userType: { type: String, required: true, trim: true },
}, { 
  timestamps: true, 
  versionKey: 'version' 
});

export const User = mongoose.model<IUser>('User', UserSchema);
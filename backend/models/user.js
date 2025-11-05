import moongose, { Schema } from 'mongoose';

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    walletAddress: { type: String, required: true, unique: true },
    profilePicture: { type: String },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    verificationExpiry: { type: Date },
    role: { type: String, enum: ['user', 'farmer', 'admin'], default: 'user'},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export const User = moongose.model('User', userSchema);


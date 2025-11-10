import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { MESSAGES } from '../constants/messages.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const maskUser = (user) => {
    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        walletAddress: user.walletAddress,
        profilePicture: user.profilePicture,
        role: user.role,
        bio: user.bio,
        tokenBalance: user.tokenBalance,
        impactMetrics: user.impactMetrics,
        farmerData: user.role === 'farmer' ? user.farmerData : undefined,
        investorData: user.role === 'investor' ? user.investorData : undefined,
    };
};

export const authController = {

    // Registro usando Google ID token + walletAddress (thirdweb provides wallet on client)
    register: async (req, res) => {
        try {
            const { idToken, walletAddress } = req.body;
            if (!idToken) return errorResponse(res, 'idToken is required', 400);
            if (!walletAddress) return errorResponse(res, 'walletAddress is required', 400);

            // Verify Google ID token
            const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
            const payload = ticket.getPayload();
            const email = payload.email;
            const emailVerified = payload.email_verified;
            const firstName = payload.given_name || '';
            const lastName = payload.family_name || '';
            const profilePicture = payload.picture || '';

            // Check if user with same wallet or email exists
            const existingWallet = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
            if (existingWallet) return errorResponse(res, 'Wallet already registered', 409);

            const existingEmail = await User.findOne({ email });
            if (existingEmail) return errorResponse(res, 'Email already registered', 409);

            // Create user
            const newUser = new User({
                firstName,
                lastName,
                email,
                walletAddress: walletAddress.toLowerCase(),
                profilePicture,
                emailVerified
            });

            await newUser.save();

            const safe = maskUser(newUser);
            return successResponse(res, { user: safe }, MESSAGES.AUTH.REGISTER_SUCCESS, 201);
        } catch (err) {
            console.error('Register error:', err);
            return errorResponse(res, MESSAGES.GENERAL.SERVER_ERROR, 500);
        }
    },

    // Login: verify Google token and wallet; return JWT
    login: async (req, res) => {
        try {
            const { idToken, walletAddress } = req.body;
            if (!idToken) return errorResponse(res, 'idToken is required', 400);
            if (!walletAddress) return errorResponse(res, 'walletAddress is required', 400);

            const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
            const payload = ticket.getPayload();
            const email = payload.email;

            // Find user by wallet or email
            const user = await User.findOne({ $or: [{ walletAddress: walletAddress.toLowerCase() }, { email }] });
            if (!user) return errorResponse(res, 'User not found. Please register first.', 404);

            // Check if user is active
            if (!user.isActive) return errorResponse(res, 'Account is deactivated', 403);
            if (user.isBanned) return errorResponse(res, `Account is banned: ${user.banReason}`, 403);

            // Optionally ensure the email matches
            if (user.email !== email) {
                return errorResponse(res, 'Google account does not match user email', 403);
            }

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            const token = jwt.sign(
                { userId: user._id, walletAddress: user.walletAddress, role: user.role }, 
                process.env.JWT_SECRET || 'dev_jwt_secret', 
                { expiresIn: '7d' }
            );

            const safe = maskUser(user);
            return successResponse(res, { user: safe, token }, MESSAGES.AUTH.LOGIN_SUCCESS);
        } catch (err) {
            console.error('Login error:', err);
            return errorResponse(res, MESSAGES.GENERAL.SERVER_ERROR, 500);
        }
    }

};

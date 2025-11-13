import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { MESSAGES } from '../constants/messages.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const maskUser = (user) => {
    return {
        _id: user._id,
        id: user._id,
        name: `${user.firstName} ${user.lastName}`.trim() || user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        walletAddress: user.walletAddress,
        profilePicture: user.profilePicture,
        role: user.role,
        bio: user.bio,
        tokenBalance: user.tokenBalance,
        impactMetrics: user.impactMetrics,
        isVerified: user.emailVerified,
        farmerData: user.role === 'farmer' ? user.farmerData : undefined,
        investorData: user.role === 'investor' ? user.investorData : undefined,
    };
};

const generateToken = (user) => {
    return jwt.sign(
        { userId: user._id, walletAddress: user.walletAddress, role: user.role },
        process.env.JWT_SECRET || 'dev_jwt_secret',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

export const authController = {

    // Traditional registration with email/password
    register: async (req, res) => {
        try {
            const { email, password, name, role, walletAddress, idToken } = req.body;

            // Check if using Google OAuth or traditional registration
            if (idToken) {
                // Google OAuth registration
                return authController.registerWithGoogle(req, res);
            }

            // Traditional registration
            if (!email || !password || !name) {
                return errorResponse(res, 'Email, password, and name are required', 400);
            }

            // Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return errorResponse(res, 'Email already registered', 409);
            }

            // Check wallet if provided
            if (walletAddress) {
                const existingWallet = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
                if (existingWallet) {
                    return errorResponse(res, 'Wallet already registered', 409);
                }
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Parse name
            const nameParts = name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Create user
            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                walletAddress: walletAddress?.toLowerCase(),
                role: role || 'investor',
                emailVerified: false,
            });

            await newUser.save();

            const token = generateToken(newUser);
            const safe = maskUser(newUser);

            return successResponse(res, { user: safe, token }, MESSAGES.AUTH.REGISTER_SUCCESS, 201);
        } catch (err) {
            console.error('Register error:', err);
            return errorResponse(res, MESSAGES.GENERAL.SERVER_ERROR, 500);
        }
    },

    // Registro usando Google ID token + walletAddress (thirdweb provides wallet on client)
    registerWithGoogle: async (req, res) => {
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

            const token = generateToken(newUser);
            const safe = maskUser(newUser);
            return successResponse(res, { user: safe, token }, MESSAGES.AUTH.REGISTER_SUCCESS, 201);
        } catch (err) {
            console.error('Register error:', err);
            return errorResponse(res, MESSAGES.GENERAL.SERVER_ERROR, 500);
        }
    },

    // Traditional login with email/password
    login: async (req, res) => {
        try {
            const { email, password, idToken, walletAddress } = req.body;

            // Check if using Google OAuth or traditional login
            if (idToken) {
                return authController.loginWithGoogle(req, res);
            }

            // Traditional login
            if (!email || !password) {
                return errorResponse(res, 'Email and password are required', 400);
            }

            // Find user
            const user = await User.findOne({ email });
            if (!user) {
                return errorResponse(res, 'Invalid email or password', 401);
            }

            // Check if user has password (not OAuth-only account)
            if (!user.password) {
                return res.status(401).json({
                    success: false,
                    message: 'Please login with Google',
                    accountType: 'google',
                    email: user.email
                });
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return errorResponse(res, 'Invalid email or password', 401);
            }

            // Check if user is active
            if (!user.isActive) return errorResponse(res, 'Account is deactivated', 403);
            if (user.isBanned) return errorResponse(res, `Account is banned: ${user.banReason}`, 403);

            // Update last login
            user.lastLogin = new Date();
            await user.save();

            const token = generateToken(user);
            const safe = maskUser(user);

            return successResponse(res, { user: safe, token }, MESSAGES.AUTH.LOGIN_SUCCESS);
        } catch (err) {
            console.error('Login error:', err);
            return errorResponse(res, MESSAGES.GENERAL.SERVER_ERROR, 500);
        }
    },

    // Login: verify Google token and wallet; return JWT
    loginWithGoogle: async (req, res) => {
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

            const token = generateToken(user);
            const safe = maskUser(user);
            
            return successResponse(res, { user: safe, token }, MESSAGES.AUTH.LOGIN_SUCCESS);
        } catch (err) {
            console.error('Login error:', err);
            return errorResponse(res, MESSAGES.GENERAL.SERVER_ERROR, 500);
        }
    },

    // NEW: Simple wallet-based registration (for Thirdweb Google OAuth)
    // Thirdweb handles Google OAuth on client, we just create user with wallet + basic info
    registerWallet: async (req, res) => {
        try {
            const { email, name, role, walletAddress } = req.body;

            if (!email || !name || !role || !walletAddress) {
                return errorResponse(res, 'Email, name, role, and walletAddress are required', 400);
            }

            // Validate role
            if (!['farmer', 'investor'].includes(role)) {
                return errorResponse(res, 'Role must be farmer or investor', 400);
            }

            // Check if user exists with this wallet or email (normalize for lookup)
            const existingWallet = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
            if (existingWallet) {
                return errorResponse(res, 'Wallet already registered', 409);
            }

            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return errorResponse(res, 'Email already registered', 409);
            }

            // Parse name
            const nameParts = name.trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Create user without password (wallet-based auth)
            const newUser = new User({
                firstName,
                lastName,
                email,
                walletAddress: walletAddress.toLowerCase(),
                role,
                emailVerified: true, // Assume verified since from Google OAuth
                password: undefined, // No password for wallet-only accounts
            });

            await newUser.save();

            const token = generateToken(newUser);
            const safe = maskUser(newUser);

            return successResponse(res, { user: safe, token }, 'Account created successfully', 201);
        } catch (err) {
            console.error('Register wallet error:', err);
            return errorResponse(res, MESSAGES.GENERAL.SERVER_ERROR, 500);
        }
    }

};

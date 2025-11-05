import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const maskUser = (user) => {
    return {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        walletAddress: user.walletAddress,
        profilePicture: user.profilePicture,
        role: user.role
    };
};

export const authController = {

    // Registro usando Google ID token + walletAddress (thirdweb provides wallet on client)
    register: async (req, res) => {
        try {
            const { idToken, walletAddress } = req.body;
            if (!idToken) return res.status(400).json({ message: 'idToken is required' });
            if (!walletAddress) return res.status(400).json({ message: 'walletAddress is required' });

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
            if (existingWallet) return res.status(409).json({ message: 'Wallet already registered' });

            const existingEmail = await User.findOne({ email });
            if (existingEmail) return res.status(409).json({ message: 'Email already registered' });

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
            return res.status(201).json({ user: safe });
        } catch (err) {
            console.error('Register error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Login: verify Google token and wallet; return JWT
    login: async (req, res) => {
        try {
            const { idToken, walletAddress } = req.body;
            if (!idToken) return res.status(400).json({ message: 'idToken is required' });
            if (!walletAddress) return res.status(400).json({ message: 'walletAddress is required' });

            const ticket = await googleClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
            const payload = ticket.getPayload();
            const email = payload.email;

            // Find user by wallet or email
            const user = await User.findOne({ $or: [{ walletAddress: walletAddress.toLowerCase() }, { email }] });
            if (!user) return res.status(404).json({ message: 'User not found. Please register first.' });

            // Optionally ensure the email matches
            if (user.email !== email) {
                // If email differs, reject to avoid account mismatch
                return res.status(403).json({ message: 'Google account does not match user email' });
            }

            const token = jwt.sign({ userId: user._id, walletAddress: user.walletAddress, role: user.role }, process.env.JWT_SECRET || 'dev_jwt_secret', { expiresIn: '7d' });

            const safe = maskUser(user);
            return res.json({ user: safe, token });
        } catch (err) {
            console.error('Login error:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

};

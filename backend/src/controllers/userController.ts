import { Request, Response } from 'express';
import { User, IUser } from '../models/user';

// Interface for request body
interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  walletAddress: string;
  userType: string;
}

interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  walletAddress?: string;
  userType?: string;
}

// Interface for API response
interface ApiResponse<T = any> {
  success: boolean;
  message?: string; 
  data?: T;
  count?: number;
  error?: string;
}
// Custom error type for MongoDB errors
interface MongoError extends Error {
  kind?: string;
  code?: number;
}

// Create a new user
export const createUser = async (req: Request<{}, {}, CreateUserRequest>, res: Response<ApiResponse<IUser>>): Promise<void> => {
  try {
    const { firstName, lastName, email, walletAddress, userType } = req.body;

    // Check if user already exists with email or wallet address
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { walletAddress: walletAddress.toLowerCase().trim() }
      ]
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "User with this email or wallet address already exists"
      });
      return;
    }

    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      walletAddress: walletAddress.toLowerCase().trim(),
      userType: userType.trim()
    });

    const savedUser = await user.save();
    
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: savedUser
    });
    
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: err.message
    });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response<ApiResponse<IUser[]>>): Promise<void> => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
      message: ''
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message
    });
  }
};

// Get user by ID
export const getUserById = async (req: Request<{ id: string }>, res: Response<ApiResponse<IUser>>): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
      message: ''
    });
  } catch (error) {
    const err = error as MongoError;
    
    if (err.kind === 'ObjectId') {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: err.message
    });
  }
};

// Get user by wallet address
export const getUserByWallet = async (req: Request<{ walletAddress: string }>, res: Response<ApiResponse<IUser>>): Promise<void> => {
  try {
    const user = await User.findOne({ 
      walletAddress: req.params.walletAddress.toLowerCase().trim() 
    });
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: user,
      message: ''
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: err.message
    });
  }
};

// Update user
export const updateUser = async (req: Request<{ id: string }, {}, UpdateUserRequest>, res: Response<ApiResponse<IUser>>): Promise<void> => {
  try {
    const { firstName, lastName, email, walletAddress, userType } = req.body;
    
    // Check if email or wallet address is being updated and if it already exists
    if (email || walletAddress) {
      const queryConditions: any[] = [];
      
      if (email) {
        queryConditions.push({ email: email.toLowerCase().trim() });
      }
      if (walletAddress) {
        queryConditions.push({ walletAddress: walletAddress.toLowerCase().trim() });
      }

      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: req.params.id } },
          { $or: queryConditions }
        ]
      });

      if (existingUser) {
        res.status(400).json({
          success: false,
          message: "Email or wallet address already exists"
        });
        return;
      }
    }

    const updateData: Partial<IUser> = {};
    if (firstName) updateData.firstName = firstName.trim();
    if (lastName) updateData.lastName = lastName.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (walletAddress) updateData.walletAddress = walletAddress.toLowerCase().trim();
    if (userType) updateData.userType = userType.trim();

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user
    });
  } catch (error) {
    const err = error as MongoError;
    
    if (err.kind === 'ObjectId') {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: err.message
    });
  }
};

// Delete user
export const deleteUser = async (req: Request<{ id: string }>, res: Response<ApiResponse>): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    const err = error as MongoError;
    
    if (err.kind === 'ObjectId') {
      res.status(404).json({
        success: false,
        message: "User not found"
      });
      return;
    }
    
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: err.message
    });
  }
};
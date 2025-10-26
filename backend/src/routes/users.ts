import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  getUserByWallet,
  updateUser,
  deleteUser
} from '../controllers/userController';

const router = express.Router();

// @route   POST /api/users
// @desc    Create a new user
// @access  Public
router.post("/", createUser);

// @route   GET /api/users
// @desc    Get all users
// @access  Public
router.get("/", getAllUsers);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get("/:id", getUserById);

// @route   GET /api/users/wallet/:walletAddress
// @desc    Get user by wallet address
// @access  Public
router.get("/wallet/:walletAddress", getUserByWallet);

// @route   PUT /api/users/:id
// @desc    Update user by ID
// @access  Public
router.put("/:id", updateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user by ID
// @access  Public
router.delete("/:id", deleteUser);

export default router;
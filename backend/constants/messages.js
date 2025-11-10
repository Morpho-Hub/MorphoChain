export const MESSAGES = {
  // Auth
  AUTH: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTER_SUCCESS: 'Registration successful',
    UNAUTHORIZED: 'Unauthorized access',
    INVALID_TOKEN: 'Invalid or expired token',
    INVALID_CREDENTIALS: 'Invalid credentials',
  },

  // User
  USER: {
    NOT_FOUND: 'User not found',
    UPDATED: 'User updated successfully',
    DELETED: 'User deleted successfully',
    ALREADY_EXISTS: 'User already exists',
    PROFILE_UPDATED: 'Profile updated successfully',
  },

  // Farm
  FARM: {
    CREATED: 'Farm created successfully',
    UPDATED: 'Farm updated successfully',
    DELETED: 'Farm deleted successfully',
    NOT_FOUND: 'Farm not found',
    NOT_OWNER: 'You are not the owner of this farm',
    ALREADY_FUNDED: 'Farm is already fully funded',
  },

  // Product
  PRODUCT: {
    CREATED: 'Product created successfully',
    UPDATED: 'Product updated successfully',
    DELETED: 'Product deleted successfully',
    NOT_FOUND: 'Product not found',
    OUT_OF_STOCK: 'Product is out of stock',
    INSUFFICIENT_STOCK: 'Insufficient stock',
  },

  // Investment
  INVESTMENT: {
    CREATED: 'Investment created successfully',
    UPDATED: 'Investment updated successfully',
    NOT_FOUND: 'Investment not found',
    BELOW_MINIMUM: 'Investment amount below minimum',
    ABOVE_MAXIMUM: 'Investment amount exceeds available',
  },

  // Transaction
  TRANSACTION: {
    CREATED: 'Transaction created successfully',
    NOT_FOUND: 'Transaction not found',
    FAILED: 'Transaction failed',
    PENDING: 'Transaction is pending',
  },

  // General
  GENERAL: {
    SUCCESS: 'Operation successful',
    ERROR: 'An error occurred',
    INVALID_DATA: 'Invalid data provided',
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Internal server error',
    NOT_FOUND: 'Resource not found',
    FORBIDDEN: 'Access forbidden',
  },

  // Roles
  ROLE: {
    INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
    FARMER_ONLY: 'This action is only available to farmers',
    INVESTOR_ONLY: 'This action is only available to investors',
    ADMIN_ONLY: 'This action is only available to administrators',
  },
};

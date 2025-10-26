/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - walletAddress
 *         - userType
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *           example: "507f1f77bcf86cd799439011"
 *         firstName:
 *           type: string
 *           description: User's first name
 *           example: "John"
 *         lastName:
 *           type: string
 *           description: User's last name
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address (must be unique)
 *           example: "john.doe@example.com"
 *         walletAddress:
 *           type: string
 *           description: Blockchain wallet address (must be unique)
 *           example: "0x742d35Cc6634C0532925a3b8D6B398f3D6B5C7A1"
 *         userType:
 *           type: string
 *           description: Type of user (admin, creator, collector, etc.)
 *           enum: ["admin", "creator", "collector", "viewer"]
 *           example: "collector"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated creation timestamp
 *           example: "2023-10-05T14:48:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Auto-generated last update timestamp
 *           example: "2023-10-05T14:48:00.000Z"
 * 
 *     UserInput:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - walletAddress
 *         - userType
 *       properties:
 *         firstName:
 *           type: string
 *           example: "John"
 *         lastName:
 *           type: string
 *           example: "Doe"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         walletAddress:
 *           type: string
 *           example: "0x742d35Cc6634C0532925a3b8D6B398f3D6B5C7A1"
 *         userType:
 *           type: string
 *           enum: ["admin", "creator", "collector", "viewer"]
 *           example: "collector"
 * 
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Operation completed successfully"
 *         data:
 *           type: object
 *           nullable: true
 * 
 *   parameters:
 *     userId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: MongoDB user ID
 *     walletAddress:
 *       in: path
 *       name: walletAddress
 *       required: true
 *       schema:
 *         type: string
 *       description: Blockchain wallet address
 * 
 *   responses:
 *     NotFound:
 *       description: User not found
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "User not found"
 *     ValidationError:
 *       description: Validation failed
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Validation error description"
 *               error:
 *                 type: string
 *                 example: "Detailed error message"
 *     ServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Error processing request"
 *               error:
 *                 type: string
 *                 example: "Detailed error message"
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 *   x-logo:
 *     url: https://example.com/logo.png
 *     altText: Users API
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: |
 *       Creates a new user in the system. 
 *       **Important Notes:**
 *       - Email must be unique across all users
 *       - Wallet address must be unique across all users
 *       - Wallet address should be a valid blockchain address (Ethereum format)
 *       - User type must be one of the predefined values
 *       
 *       **Wallet Integration:** This endpoint expects the user to already have a wallet address.
 *       The frontend should handle wallet connection using services like thirdweb, MetaMask, etc.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *           examples:
 *             basicUser:
 *               summary: Basic user creation
 *               value:
 *                 firstName: "Alice"
 *                 lastName: "Smith"
 *                 email: "alice.smith@example.com"
 *                 walletAddress: "0x742d35Cc6634C0532925a3b8D6B398f3D6B5C7A1"
 *                 userType: "collector"
 *             creatorUser:
 *               summary: Creator user
 *               value:
 *                 firstName: "Bob"
 *                 lastName: "Artist"
 *                 email: "bob.artist@example.com"
 *                 walletAddress: "0x8ba1f109551bD432803012645Ac136ddd64DBA72"
 *                 userType: "creator"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "User created successfully"
 *                   data:
 *                     _id: "507f1f77bcf86cd799439011"
 *                     firstName: "Alice"
 *                     lastName: "Smith"
 *                     email: "alice.smith@example.com"
 *                     walletAddress: "0x742d35Cc6634C0532925a3b8D6B398f3D6B5C7A1"
 *                     userType: "collector"
 *                     createdAt: "2023-10-05T14:48:00.000Z"
 *                     updatedAt: "2023-10-05T14:48:00.000Z"
 *       400:
 *         description: Bad request - Validation error or duplicate user
 *         content:
 *           application/json:
 *             examples:
 *               duplicateEmail:
 *                 value:
 *                   success: false
 *                   message: "User with this email or wallet address already exists"
 *               missingFields:
 *                 value:
 *                   success: false
 *                   message: "Error creating user"
 *                   error: "User validation failed: email: Path `email` is required."
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users in the system, sorted by creation date (newest first)
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of users per page
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 2
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   count: 2
 *                   data:
 *                     - _id: "507f1f77bcf86cd799439011"
 *                       firstName: "Alice"
 *                       lastName: "Smith"
 *                       email: "alice.smith@example.com"
 *                       walletAddress: "0x742d35Cc6634C0532925a3b8D6B398f3D6B5C7A1"
 *                       userType: "collector"
 *                       createdAt: "2023-10-05T14:48:00.000Z"
 *                       updatedAt: "2023-10-05T14:48:00.000Z"
 *                     - _id: "507f1f77bcf86cd799439012"
 *                       firstName: "Bob"
 *                       lastName: "Artist"
 *                       email: "bob.artist@example.com"
 *                       walletAddress: "0x8ba1f109551bD432803012645Ac136ddd64DBA72"
 *                       userType: "creator"
 *                       createdAt: "2023-10-05T14:45:00.000Z"
 *                       updatedAt: "2023-10-05T14:45:00.000Z"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their MongoDB ID
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/userId'
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 *   put:
 *     summary: Update user by ID
 *     description: Update an existing user's information. All fields are optional - only provided fields will be updated.
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/userId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Alice"
 *               lastName:
 *                 type: string
 *                 example: "Johnson"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "alice.johnson@example.com"
 *               walletAddress:
 *                 type: string
 *                 example: "0x742d35Cc6634C0532925a3b8D6B398f3D6B5C7A1"
 *               userType:
 *                 type: string
 *                 enum: ["admin", "creator", "collector", "viewer"]
 *                 example: "creator"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 * 
 *   delete:
 *     summary: Delete user by ID
 *     description: Permanently delete a user from the system
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/userId'
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "User deleted successfully"
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */

/**
 * @swagger
 * /api/users/wallet/{walletAddress}:
 *   get:
 *     summary: Get user by wallet address
 *     description: |
 *       Retrieve a user by their blockchain wallet address. 
 *       This is particularly useful for:
 *       - Checking if a wallet is already registered
 *       - User lookup after wallet connection
 *       - Linking on-chain activities to user profiles
 *       
 *       **Wallet Integration:** This endpoint is essential for connecting your backend with wallet services like thirdweb.
 *       When a user connects their wallet in the frontend, you can use this endpoint to fetch their profile.
 *     tags: [Users]
 *     parameters:
 *       - $ref: '#/components/parameters/walletAddress'
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
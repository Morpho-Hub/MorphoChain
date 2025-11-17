// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/extension/PermissionsEnumerable.sol";

interface IMorphoCoin {
    function mintToPlantation(address plantation, uint256 amount, string memory plantationId) external;
    function freezeTokens(address account, uint256 amount) external;
    function unfreezeTokens(address account, uint256 amount) external;
    function frozenBalanceOf(address account) external view returns (uint256);
    function availableBalanceOf(address account) external view returns (uint256);
}

/**
 * @title PlantationManager
 * @dev Manages plantation registrations and token operations
 */
contract PlantationManager is PermissionsEnumerable {
    
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    
    IMorphoCoin public morphoCoin;
    
    struct Plantation {
        string plantationId;
        address walletAddress;
        uint256 totalMinted;
        uint256 frozenAmount;
        bool isActive;
        uint256 registeredAt;
    }
    
    // Mapping from plantation ID to plantation data
    mapping(string => Plantation) public plantations;
    
    // Mapping from wallet address to plantation ID
    mapping(address => string) public walletToPlantation;
    
    // Array to track all plantation IDs
    string[] public plantationIds;
    
    // Events
    event PlantationRegistered(string indexed plantationId, address indexed wallet);
    event PlantationDeactivated(string indexed plantationId);
    event TokensMinted(string indexed plantationId, uint256 amount);
    event TokensFrozenForPlantation(string indexed plantationId, uint256 amount);
    event TokensUnfrozenForPlantation(string indexed plantationId, uint256 amount);
    
    constructor(address _morphoCoinAddress, address _defaultAdmin) {
        morphoCoin = IMorphoCoin(_morphoCoinAddress);
        _setupRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);
        _setupRole(MANAGER_ROLE, _defaultAdmin);
    }
    
    /**
     * @dev Register a new plantation
     * @param plantationId Unique identifier for the plantation
     * @param walletAddress Wallet address for the plantation
     */
    function registerPlantation(
        string memory plantationId,
        address walletAddress
    ) external onlyRole(MANAGER_ROLE) {
        require(walletAddress != address(0), "Invalid wallet address");
        require(bytes(plantationId).length > 0, "Invalid plantation ID");
        require(!plantations[plantationId].isActive, "Plantation already registered");
        require(bytes(walletToPlantation[walletAddress]).length == 0, "Wallet already assigned");
        
        plantations[plantationId] = Plantation({
            plantationId: plantationId,
            walletAddress: walletAddress,
            totalMinted: 0,
            frozenAmount: 0,
            isActive: true,
            registeredAt: block.timestamp
        });
        
        walletToPlantation[walletAddress] = plantationId;
        plantationIds.push(plantationId);
        
        emit PlantationRegistered(plantationId, walletAddress);
    }
    
    /**
     * @dev Mint tokens to a plantation
     * @param plantationId ID of the plantation
     * @param amount Amount of tokens to mint
     */
    function mintToPlantation(
        string memory plantationId,
        uint256 amount
    ) external onlyRole(MANAGER_ROLE) {
        Plantation storage plantation = plantations[plantationId];
        require(plantation.isActive, "Plantation not active");
        require(amount > 0, "Amount must be greater than 0");
        
        morphoCoin.mintToPlantation(plantation.walletAddress, amount, plantationId);
        plantation.totalMinted += amount;
        
        emit TokensMinted(plantationId, amount);
    }
    
    /**
     * @dev Freeze tokens for a plantation
     * @param plantationId ID of the plantation
     * @param amount Amount of tokens to freeze
     */
    function freezePlantationTokens(
        string memory plantationId,
        uint256 amount
    ) external onlyRole(MANAGER_ROLE) {
        Plantation storage plantation = plantations[plantationId];
        require(plantation.isActive, "Plantation not active");
        require(amount > 0, "Amount must be greater than 0");
        
        morphoCoin.freezeTokens(plantation.walletAddress, amount);
        plantation.frozenAmount += amount;
        
        emit TokensFrozenForPlantation(plantationId, amount);
    }
    
    /**
     * @dev Unfreeze tokens for a plantation
     * @param plantationId ID of the plantation
     * @param amount Amount of tokens to unfreeze
     */
    function unfreezePlantationTokens(
        string memory plantationId,
        uint256 amount
    ) external onlyRole(MANAGER_ROLE) {
        Plantation storage plantation = plantations[plantationId];
        require(plantation.isActive, "Plantation not active");
        require(amount > 0, "Amount must be greater than 0");
        require(plantation.frozenAmount >= amount, "Insufficient frozen amount");
        
        morphoCoin.unfreezeTokens(plantation.walletAddress, amount);
        plantation.frozenAmount -= amount;
        
        emit TokensUnfrozenForPlantation(plantationId, amount);
    }
    
    /**
     * @dev Deactivate a plantation
     * @param plantationId ID of the plantation
     */
    function deactivatePlantation(string memory plantationId) external onlyRole(MANAGER_ROLE) {
        Plantation storage plantation = plantations[plantationId];
        require(plantation.isActive, "Plantation already inactive");
        
        plantation.isActive = false;
        emit PlantationDeactivated(plantationId);
    }
    
    /**
     * @dev Get plantation details
     * @param plantationId ID of the plantation
     */
    function getPlantation(string memory plantationId) external view returns (Plantation memory) {
        return plantations[plantationId];
    }
    
    /**
     * @dev Get plantation ID from wallet address
     * @param wallet Wallet address
     */
    function getPlantationByWallet(address wallet) external view returns (string memory) {
        return walletToPlantation[wallet];
    }
    
    /**
     * @dev Get total number of plantations
     */
    function getTotalPlantations() external view returns (uint256) {
        return plantationIds.length;
    }
}
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC20Base.sol";
import "@thirdweb-dev/contracts/extension/PermissionsEnumerable.sol";

/**
 * @title MorphoCoin
 * @dev Main token for agricultural asset tokenization platform
 * Features:
 * - Minting to plantations
 * - Token freezing mechanism
 * - Transfer controls
 */
contract MorphoCoin is ERC20Base, PermissionsEnumerable {
    
    // Role for minting tokens to plantations
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    // Role for freezing/unfreezing tokens
    bytes32 public constant FREEZER_ROLE = keccak256("FREEZER_ROLE");
    
    // Mapping to track frozen balances per address
    mapping(address => uint256) private _frozenBalances;
    
    // Events
    event TokensFrozen(address indexed account, uint256 amount);
    event TokensUnfrozen(address indexed account, uint256 amount);
    event TokensMintedToPlantation(address indexed plantation, uint256 amount, string plantationId);
    
    constructor(
        address _defaultAdmin,
        string memory _name,
        string memory _symbol
    )
        ERC20Base(
            _defaultAdmin,
            _name,
            _symbol
        )
    {
        _setupRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);
        _setupRole(MINTER_ROLE, _defaultAdmin);
        _setupRole(FREEZER_ROLE, _defaultAdmin);
    }
    
    /**
     * @dev Mint tokens to a plantation wallet
     * @param plantation Address of the plantation wallet
     * @param amount Amount of tokens to mint
     * @param plantationId Identifier for the plantation (for tracking)
     */
    function mintToPlantation(
        address plantation,
        uint256 amount,
        string memory plantationId
    ) external onlyRole(MINTER_ROLE) {
        require(plantation != address(0), "Invalid plantation address");
        require(amount > 0, "Amount must be greater than 0");
        
        _mint(plantation, amount);
        emit TokensMintedToPlantation(plantation, amount, plantationId);
    }
    
    /**
     * @dev Freeze tokens for a specific address
     * Frozen tokens remain in the wallet but cannot be transferred
     * @param account Address to freeze tokens for
     * @param amount Amount of tokens to freeze
     */
    function freezeTokens(address account, uint256 amount) external onlyRole(FREEZER_ROLE) {
        require(account != address(0), "Invalid account address");
        require(amount > 0, "Amount must be greater than 0");
        
        uint256 availableBalance = balanceOf(account) - _frozenBalances[account];
        require(availableBalance >= amount, "Insufficient available balance");
        
        _frozenBalances[account] += amount;
        emit TokensFrozen(account, amount);
    }
    
    /**
     * @dev Unfreeze tokens for a specific address
     * @param account Address to unfreeze tokens for
     * @param amount Amount of tokens to unfreeze
     */
    function unfreezeTokens(address account, uint256 amount) external onlyRole(FREEZER_ROLE) {
        require(account != address(0), "Invalid account address");
        require(amount > 0, "Amount must be greater than 0");
        require(_frozenBalances[account] >= amount, "Insufficient frozen balance");
        
        _frozenBalances[account] -= amount;
        emit TokensUnfrozen(account, amount);
    }
    
    /**
     * @dev Get the frozen balance of an account
     * @param account Address to check
     * @return Frozen balance amount
     */
    function frozenBalanceOf(address account) external view returns (uint256) {
        return _frozenBalances[account];
    }
    
    /**
     * @dev Get the available (unfrozen) balance of an account
     * @param account Address to check
     * @return Available balance amount
     */
    function availableBalanceOf(address account) external view returns (uint256) {
        return balanceOf(account) - _frozenBalances[account];
    }
    
    /**
     * @dev Override transfer to check for frozen tokens
     */
    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        address owner = _msgSender();
        uint256 availableBalance = balanceOf(owner) - _frozenBalances[owner];
        require(availableBalance >= amount, "Transfer amount exceeds available balance");
        
        _transfer(owner, to, amount);
        return true;
    }
    
    /**
     * @dev Override transferFrom to check for frozen tokens
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        uint256 availableBalance = balanceOf(from) - _frozenBalances[from];
        require(availableBalance >= amount, "Transfer amount exceeds available balance");
        
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }
}
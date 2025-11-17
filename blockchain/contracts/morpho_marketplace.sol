// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/extension/PermissionsEnumerable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title MorphoMarketplace
 * @dev Marketplace for buying and selling MorphoCoin tokens
 * Supports listing tokens for sale and purchasing listed tokens
 */
contract MorphoMarketplace is PermissionsEnumerable, ReentrancyGuard {
    
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    
    IERC20 public morphoCoin;
    
    struct Listing {
        uint256 listingId;
        address seller;
        uint256 amount;
        uint256 pricePerToken; // In wei
        bool isActive;
        uint256 createdAt;
    }
    
    // Listing ID counter
    uint256 private _listingIdCounter;
    
    // Mapping from listing ID to listing data
    mapping(uint256 => Listing) public listings;
    
    // Mapping from seller to their listing IDs
    mapping(address => uint256[]) public sellerListings;
    
    // Active listing IDs array
    uint256[] public activeListingIds;
    
    // Platform fee percentage (in basis points, e.g., 250 = 2.5%)
    uint256 public platformFeeBps = 250;
    
    // Address to receive platform fees
    address public feeRecipient;
    
    // Events
    event ListingCreated(uint256 indexed listingId, address indexed seller, uint256 amount, uint256 pricePerToken);
    event ListingCancelled(uint256 indexed listingId);
    event ListingCompleted(uint256 indexed listingId, address indexed buyer, uint256 amount, uint256 totalPrice);
    event PlatformFeeUpdated(uint256 newFeeBps);
    event FeeRecipientUpdated(address newRecipient);
    
    constructor(
        address _morphoCoinAddress,
        address _feeRecipient,
        address _defaultAdmin
    ) {
        require(_morphoCoinAddress != address(0), "Invalid token address");
        require(_feeRecipient != address(0), "Invalid fee recipient");
        
        morphoCoin = IERC20(_morphoCoinAddress);
        feeRecipient = _feeRecipient;
        
        _setupRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);
        _setupRole(OPERATOR_ROLE, _defaultAdmin);
    }
    
    /**
     * @dev Create a new listing to sell tokens
     * @param amount Amount of tokens to sell
     * @param pricePerToken Price per token in wei
     */
    function createListing(
        uint256 amount,
        uint256 pricePerToken
    ) external nonReentrant returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(pricePerToken > 0, "Price must be greater than 0");
        
        // Check seller has enough tokens
        require(morphoCoin.balanceOf(msg.sender) >= amount, "Insufficient token balance");
        
        // Transfer tokens to marketplace for escrow
        require(
            morphoCoin.transferFrom(msg.sender, address(this), amount),
            "Token transfer failed"
        );
        
        uint256 listingId = _listingIdCounter++;
        
        listings[listingId] = Listing({
            listingId: listingId,
            seller: msg.sender,
            amount: amount,
            pricePerToken: pricePerToken,
            isActive: true,
            createdAt: block.timestamp
        });
        
        sellerListings[msg.sender].push(listingId);
        activeListingIds.push(listingId);
        
        emit ListingCreated(listingId, msg.sender, amount, pricePerToken);
        
        return listingId;
    }
    
    /**
     * @dev Buy tokens from a listing
     * @param listingId ID of the listing to buy from
     * @param amount Amount of tokens to buy
     */
    function buyFromListing(uint256 listingId, uint256 amount) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= listing.amount, "Amount exceeds listing");
        require(msg.sender != listing.seller, "Cannot buy own listing");
        
        uint256 totalPrice = amount * listing.pricePerToken;
        require(msg.value >= totalPrice, "Insufficient payment");
        
        // Calculate platform fee
        uint256 platformFee = (totalPrice * platformFeeBps) / 10000;
        uint256 sellerAmount = totalPrice - platformFee;
        
        // Update listing
        listing.amount -= amount;
        if (listing.amount == 0) {
            listing.isActive = false;
            _removeFromActiveListings(listingId);
        }
        
        // Transfer tokens to buyer
        require(
            morphoCoin.transfer(msg.sender, amount),
            "Token transfer to buyer failed"
        );
        
        // Transfer payment to seller
        (bool sellerTransfer, ) = listing.seller.call{value: sellerAmount}("");
        require(sellerTransfer, "Payment to seller failed");
        
        // Transfer platform fee
        (bool feeTransfer, ) = feeRecipient.call{value: platformFee}("");
        require(feeTransfer, "Platform fee transfer failed");
        
        // Refund excess payment
        if (msg.value > totalPrice) {
            (bool refund, ) = msg.sender.call{value: msg.value - totalPrice}("");
            require(refund, "Refund failed");
        }
        
        emit ListingCompleted(listingId, msg.sender, amount, totalPrice);
    }
    
    /**
     * @dev Cancel a listing
     * @param listingId ID of the listing to cancel
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(
            msg.sender == listing.seller || hasRole(OPERATOR_ROLE, msg.sender),
            "Not authorized"
        );
        
        uint256 refundAmount = listing.amount;
        listing.isActive = false;
        listing.amount = 0;
        
        _removeFromActiveListings(listingId);
        
        // Return tokens to seller
        require(
            morphoCoin.transfer(listing.seller, refundAmount),
            "Token refund failed"
        );
        
        emit ListingCancelled(listingId);
    }
    
    /**
     * @dev Update platform fee percentage
     * @param newFeeBps New fee in basis points (max 1000 = 10%)
     */
    function updatePlatformFee(uint256 newFeeBps) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newFeeBps <= 1000, "Fee too high"); // Max 10%
        platformFeeBps = newFeeBps;
        emit PlatformFeeUpdated(newFeeBps);
    }
    
    /**
     * @dev Update fee recipient address
     * @param newRecipient New fee recipient address
     */
    function updateFeeRecipient(address newRecipient) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newRecipient != address(0), "Invalid address");
        feeRecipient = newRecipient;
        emit FeeRecipientUpdated(newRecipient);
    }
    
    /**
     * @dev Get listing details
     * @param listingId ID of the listing
     */
    function getListing(uint256 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }
    
    /**
     * @dev Get all listings for a seller
     * @param seller Address of the seller
     */
    function getSellerListings(address seller) external view returns (uint256[] memory) {
        return sellerListings[seller];
    }
    
    /**
     * @dev Get all active listing IDs
     */
    function getActiveListings() external view returns (uint256[] memory) {
        return activeListingIds;
    }
    
    /**
     * @dev Get total number of listings created
     */
    function getTotalListings() external view returns (uint256) {
        return _listingIdCounter;
    }
    
    /**
     * @dev Internal function to remove listing from active array
     */
    function _removeFromActiveListings(uint256 listingId) private {
        for (uint256 i = 0; i < activeListingIds.length; i++) {
            if (activeListingIds[i] == listingId) {
                activeListingIds[i] = activeListingIds[activeListingIds.length - 1];
                activeListingIds.pop();
                break;
            }
        }
    }
}
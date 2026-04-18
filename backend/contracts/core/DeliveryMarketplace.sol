// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

import "../token/RewardToken.sol";
import "../token/GreenDeliveryNFT.sol";
import "./OrderEscrow.sol";
import "./Reputation.sol";
import "../token/DriverProfileNFT.sol";

contract DeliveryMarketplace is AccessControl, Pausable {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    OrderEscrow public escrow;
    RewardToken public rewardToken;
    Reputation public reputation;
    GreenDeliveryNFT public greenNFT;
    DriverProfileNFT public driverProfile; 
    address public platformFeeRecipient;

    uint256 public platformFeeBps; // out of 10_000 (basis points)

    mapping(address => bool) public isDriver;
    mapping(address => bool) public isRestaurant;

    constructor(
        address admin,
        OrderEscrow _escrow,
        RewardToken _rewardToken,
        Reputation _reputation,
        GreenDeliveryNFT _greenNFT,
        DriverProfileNFT _driverProfile, 
        address _platformFeeRecipient,
        uint256 _platformFeeBps
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);

        escrow = _escrow;
        rewardToken = _rewardToken;
        reputation = _reputation;
        greenNFT = _greenNFT;
        driverProfile = _driverProfile;  
        platformFeeRecipient = _platformFeeRecipient;
        platformFeeBps = _platformFeeBps;
    }


    function setPlatformFeeBps(uint256 newFeeBps)
        external
        onlyRole(OPERATOR_ROLE)
    {
        require(newFeeBps <= 1_000, "Fee too high"); // e.g. <= 10%
        platformFeeBps = newFeeBps;
    }

    function setPlatformFeeRecipient(address newRecipient)
        external
        onlyRole(OPERATOR_ROLE)
    {
        require(newRecipient != address(0), "Zero address");
        platformFeeRecipient = newRecipient;
    }
    
    // Admin / registration

    function addDriver(address driver, string calldata uri)
        external
        onlyRole(OPERATOR_ROLE)
    {
        require(!isDriver[driver], "Already driver");
        isDriver[driver] = true;

        // Mint soulbound profile if they don't already have one
        if (driverProfile.profileTokenOf(driver) == 0) {
            driverProfile.mintProfile(driver, uri);
        }
    }

    function addRestaurant(address rest) external onlyRole(OPERATOR_ROLE) {
        isRestaurant[rest] = true;
    }

    // Order flow

    function createOrder(
        address restaurant,
        address driver,
        uint256 amount
    ) external whenNotPaused returns (uint256 orderId) {
        require(isRestaurant[restaurant], "Not restaurant");
        require(isDriver[driver], "Not driver");
        // msg.sender is customer
        orderId = escrow.createOrder(msg.sender, restaurant, driver, amount);
    }

    function completeOrder(
        uint256 orderId,
        uint256 restaurantShare,
        uint256 driverShare,
        uint8 driverRating,
        bool greenDelivery,
        string calldata greenUri
    ) external onlyRole(OPERATOR_ROLE) {
        // In a real app, you’d also check that the right customer/driver
        // agreed, maybe via signatures.

        escrow.payout(orderId, restaurantShare, driverShare, platformFeeRecipient);

        // Rewards to driver
        OrderEscrow.Order memory o = escrow.getOrder(orderId);
        rewardToken.mint(o.driver, driverShare); // or some reward formula

        // Rating
        reputation.addDriverRating(o.driver, driverRating);

        // Green NFT
        if (greenDelivery) {
            greenNFT.mint(o.driver, greenUri);
        }
    }

    // Emergency

    function pause() external onlyRole(OPERATOR_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(OPERATOR_ROLE) {
        _unpause();
    }
}
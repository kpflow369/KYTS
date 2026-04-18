// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Reputation is AccessControl {
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");

    struct Stats {
        uint256 totalRating;   // sum of all ratings
        uint256 ratingCount;   // number of ratings
    }

    mapping(address => Stats) public driverStats;

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(UPDATER_ROLE, admin);
    }

    function addDriverRating(address driver, uint8 rating)
        external
        onlyRole(UPDATER_ROLE)
    {
        require(rating >= 1 && rating <= 5, "Bad rating");
        Stats storage s = driverStats[driver];
        s.totalRating += rating;
        s.ratingCount += 1;
    }

    function getAverage(address driver) external view returns (uint256) {
        Stats memory s = driverStats[driver];
        if (s.ratingCount == 0) return 0;
        return (s.totalRating * 1e18) / s.ratingCount; // scaled
    }
}
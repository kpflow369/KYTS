// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract OrderEscrow is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant MARKETPLACE_ROLE = keccak256("MARKETPLACE_ROLE");

    enum OrderStatus { None, Created, Completed, Refunded, Cancelled }

    struct Order {
        address customer;
        address restaurant;
        address driver;
        uint256 amount;
        OrderStatus status;
    }

    IERC20 public immutable paymentToken;
    uint256 public nextOrderId;
    mapping(uint256 => Order) public orders;

    function getOrder(uint orderId) external view returns (Order memory) {
        return orders[orderId];
    }

    constructor(address admin, IERC20 _paymentToken) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MARKETPLACE_ROLE, admin);
        paymentToken = _paymentToken;
    }

    function createOrder(
        address customer,
        address restaurant,
        address driver,
        uint256 amount
    ) external onlyRole(MARKETPLACE_ROLE) returns (uint256 orderId) {
        orderId = ++nextOrderId;

        // Pull funds from customer into escrow
        paymentToken.safeTransferFrom(customer, address(this), amount);

        orders[orderId] = Order({
            customer: customer,
            restaurant: restaurant,
            driver: driver,
            amount: amount,
            status: OrderStatus.Created
        });
    }

    function payout(
        uint256 orderId,
        uint256 restaurantShare,
        uint256 driverShare,
        address platformFeeRecipient
    ) external onlyRole(MARKETPLACE_ROLE) {
        Order storage o = orders[orderId];
        require(o.status == OrderStatus.Created, "Bad status");

        uint256 total = restaurantShare + driverShare;
        require(total <= o.amount, "Too much");

        uint256 fee = o.amount - total;

        if (restaurantShare > 0) {
            paymentToken.safeTransfer(o.restaurant, restaurantShare);
        }
        if (driverShare > 0) {
            paymentToken.safeTransfer(o.driver, driverShare);
        }
        if (fee > 0) {
            paymentToken.safeTransfer(platformFeeRecipient, fee);
        }

        o.status = OrderStatus.Completed;
    }

    function refund(uint256 orderId) external onlyRole(MARKETPLACE_ROLE) {
        Order storage o = orders[orderId];
        require(o.status == OrderStatus.Created, "Bad status");

        paymentToken.safeTransfer(o.customer, o.amount);
        o.status = OrderStatus.Refunded;
    }
}
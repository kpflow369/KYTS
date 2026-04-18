const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OrderEscrow", function () {
  let admin, customer, restaurant, driver, platform;
  let PaymentToken, paymentToken;
  let OrderEscrow, escrow;

  beforeEach(async () => {
    [admin, customer, restaurant, driver, platform] = await ethers.getSigners();

    PaymentToken = await ethers.getContractFactory("RewardToken"); // acts as generic ERC20
    paymentToken = await PaymentToken.deploy(admin.address);
    await paymentToken.waitForDeployment();

    OrderEscrow = await ethers.getContractFactory("OrderEscrow");
    escrow = await OrderEscrow.deploy(admin.address, paymentToken.target);
    await escrow.waitForDeployment();

    // Give admin MARKETPLACE_ROLE (already in constructor), but you can also give to another signer if needed
    const MARKETPLACE_ROLE = await escrow.MARKETPLACE_ROLE();
    await escrow.connect(admin).grantRole(MARKETPLACE_ROLE, admin.address);

    // Fund customer and approve escrow
    const amount = ethers.parseEther("50");
    await paymentToken.connect(admin).mint(customer.address, amount);
    await paymentToken.connect(customer).approve(escrow.target, amount);
  });

  it("creates order and pulls funds", async () => {
    const amount = ethers.parseEther("50");

    await expect(
      escrow.connect(admin).createOrder(
        customer.address,
        restaurant.address,
        driver.address,
        amount
      )
    ).to.changeTokenBalances(
      paymentToken,
      [customer, escrow],
      [-amount, amount]
    );

    const order = await escrow.orders(1);
    expect(order.customer).to.equal(customer.address);
    expect(order.restaurant).to.equal(restaurant.address);
    expect(order.driver).to.equal(driver.address);
    expect(order.amount).to.equal(amount);
    expect(order.status).to.equal(1n); // OrderStatus.Created
  });

  it("prevents non-marketplace from creating orders", async () => {
    const amount = ethers.parseEther("50");
    await expect(
      escrow.connect(customer).createOrder(
        customer.address,
        restaurant.address,
        driver.address,
        amount
      )
    ).to.be.reverted; // AccessControl
  });

  it("payout splits funds correctly", async () => {
    const amount = ethers.parseEther("50");
    await escrow.connect(admin).createOrder(
      customer.address,
      restaurant.address,
      driver.address,
      amount
    );

    const restaurantShare = ethers.parseEther("30");
    const driverShare = ethers.parseEther("15"); // fee = 5

    await escrow.connect(admin).payout(
      1,
      restaurantShare,
      driverShare,
      platform.address
    );

    expect(await paymentToken.balanceOf(restaurant.address)).to.equal(restaurantShare);
    expect(await paymentToken.balanceOf(driver.address)).to.equal(driverShare);
    expect(await paymentToken.balanceOf(platform.address)).to.equal(
      amount - restaurantShare - driverShare
    );

    const order = await escrow.orders(1);
    expect(order.status).to.equal(2n); // OrderStatus.Completed
  });

  it("refund sends full amount back to customer", async () => {
    const amount = ethers.parseEther("50");
    await escrow.connect(admin).createOrder(
      customer.address,
      restaurant.address,
      driver.address,
      amount
    );

    await escrow.connect(admin).refund(1);

    expect(await paymentToken.balanceOf(customer.address)).to.equal(amount);
    const order = await escrow.orders(1);
    expect(order.status).to.equal(3n); // OrderStatus.Refunded
  });

  it("cannot payout or refund twice", async () => {
    const amount = ethers.parseEther("50");
    await escrow.connect(admin).createOrder(
      customer.address,
      restaurant.address,
      driver.address,
      amount
    );

    const restaurantShare = ethers.parseEther("30");
    const driverShare = ethers.parseEther("15");

    await escrow.connect(admin).payout(
      1,
      restaurantShare,
      driverShare,
      platform.address
    );

    await expect(
      escrow.connect(admin).refund(1)
    ).to.be.revertedWith("Bad status");

    await expect(
      escrow.connect(admin).payout(
        1,
        restaurantShare,
        driverShare,
        platform.address
      )
    ).to.be.revertedWith("Bad status");
  });
});
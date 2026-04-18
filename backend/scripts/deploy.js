const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // 1) Deploy the PAYMENT TOKEN (for now, reuse RewardToken as payment)
  const RewardToken = await ethers.getContractFactory("RewardToken");
  const paymentToken = await RewardToken.deploy(deployer.address);
  await paymentToken.waitForDeployment();
  console.log("PaymentToken:", paymentToken.target);

  // 2) Deploy the REAL RewardToken used for rewards
  const rewardToken = await RewardToken.deploy(deployer.address);
  await rewardToken.waitForDeployment();
  console.log("RewardToken:", rewardToken.target);

  // 3) Deploy Reputation
  const Reputation = await ethers.getContractFactory("Reputation");
  const reputation = await Reputation.deploy(deployer.address);
  await reputation.waitForDeployment();
  console.log("Reputation:", reputation.target);

  // 4) Deploy GreenDeliveryNFT
  const GreenNFT = await ethers.getContractFactory("GreenDeliveryNFT");
  const greenNFT = await GreenNFT.deploy(deployer.address);
  await greenNFT.waitForDeployment();
  console.log("GreenDeliveryNFT:", greenNFT.target);

  // 5) Deploy OrderEscrow with payment token
  const OrderEscrow = await ethers.getContractFactory("OrderEscrow");
  const escrow = await OrderEscrow.deploy(deployer.address, paymentToken.target);
  await escrow.waitForDeployment();
  console.log("OrderEscrow:", escrow.target);

  //DriverProfile
  const DriverProfileNFT = await ethers.getContractFactory("DriverProfileNFT");
  const driverProfile = await DriverProfileNFT.deploy(deployer.address);
  await driverProfile.waitForDeployment();
  console.log("DriverProfileNFT:", driverProfile.target);

  //OrderReceipt
  const OrderReceiptNFT = await ethers.getContractFactory("OrderReceiptNFT");
  const orderReceipt = await OrderReceiptNFT.deploy(deployer.address);
  await orderReceipt.waitForDeployment();
  console.log("OrderReceiptNFT:", orderReceipt.target);

  // Deploy GovernanceToken
  const GovernanceToken = await ethers.getContractFactory("GovernanceToken");
  const govToken = await GovernanceToken.deploy(deployer.address);
  await govToken.waitForDeployment();

  // Deploy FoodGovernor with govToken as IVotes
  const FoodGovernor = await ethers.getContractFactory("FoodGovernor");
  const governor = await FoodGovernor.deploy(govToken.target);
  await governor.waitForDeployment();



  // 6) Deploy DeliveryMarketplace, injecting all dependencies
  const Marketplace = await ethers.getContractFactory("DeliveryMarketplace");
  const marketplace = await Marketplace.deploy(
    deployer.address,    // admin
    escrow.target,       // OrderEscrow
    rewardToken.target,  // RewardToken
    reputation.target,   // Reputation
    greenNFT.target,
    driverProfile.target,     // GreenDeliveryNFT
    deployer.address,    // platformFeeRecipient (can be different later)
    500 
  );
  await marketplace.waitForDeployment();
  console.log("DeliveryMarketplace:", marketplace.target);

  // 7) WIRE ROLES (this is the “integration” step)

  // 7a) Escrow: allow marketplace to manage orders
  await (await escrow.grantRole(
    await escrow.MARKETPLACE_ROLE(),
    marketplace.target
  )).wait();

  // 7b) RewardToken: allow marketplace to mint rewards
  await (await rewardToken.grantRole(
    await rewardToken.MINTER_ROLE(),
    marketplace.target
  )).wait();

  // 7c) Reputation: allow marketplace to add ratings
  await (await reputation.grantRole(
    await reputation.UPDATER_ROLE(),
    marketplace.target
  )).wait();

  // 7d) GreenDeliveryNFT: allow marketplace to mint badges
  await (await greenNFT.grantRole(
    await greenNFT.MINTER_ROLE(),
    marketplace.target
  )).wait();

  // existing grants...
  await (await driverProfile.grantRole(
    await driverProfile.MINTER_ROLE(),
    marketplace.target
  )).wait();

  await (await orderReceipt.grantRole(
    await orderReceipt.MINTER_ROLE(),
    marketplace.target
  )).wait();

  // Grant OPERATOR_ROLE to governor (so DAO can call setters)
  await (await marketplace.grantRole(
    await marketplace.OPERATOR_ROLE(),
    governor.target
  )).wait();

  // Optionally, deployer renounces OPERATOR_ROLE so only DAO controls it
  await (await marketplace.renounceRole(
    await marketplace.OPERATOR_ROLE(),
    deployer.address
  )).wait();

  console.log("Roles wired successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
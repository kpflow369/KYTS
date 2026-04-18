const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RewardToken", function () {
  let RewardToken, token;
  let admin, user1, user2;

  beforeEach(async () => {
    [admin, user1, user2] = await ethers.getSigners();

    RewardToken = await ethers.getContractFactory("RewardToken");
    token = await RewardToken.deploy(admin.address);
    await token.waitForDeployment();
  });

  it("sets roles correctly on deploy", async () => {
    const DEFAULT_ADMIN_ROLE = await token.DEFAULT_ADMIN_ROLE();
    const MINTER_ROLE = await token.MINTER_ROLE();
    const PAUSER_ROLE = await token.PAUSER_ROLE();

    expect(await token.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.equal(true);
    expect(await token.hasRole(MINTER_ROLE, admin.address)).to.equal(true);
    expect(await token.hasRole(PAUSER_ROLE, admin.address)).to.equal(true);
  });

  it("allows minter to mint", async () => {
    const amount = ethers.parseEther("100");
    await token.connect(admin).mint(user1.address, amount);

    expect(await token.balanceOf(user1.address)).to.equal(amount);
    expect(await token.totalSupply()).to.equal(amount);
  });

  it("prevents non-minter from minting", async () => {
    const amount = ethers.parseEther("100");

    await expect(
      token.connect(user1).mint(user1.address, amount)
    ).to.be.reverted; // AccessControl will revert if caller doesn’t have role[web:82][web:84]
  });

  it("pausing blocks transfers and unpausing restores them", async () => {
    const amount = ethers.parseEther("10");
    await token.connect(admin).mint(admin.address, amount);

    // pause
    await token.connect(admin).pause();

    await expect(
      token.connect(admin).transfer(user1.address, amount)
    ).to.be.reverted; // because of whenNotPaused in _beforeTokenTransfer[web:63][web:70]

    // unpause
    await token.connect(admin).unpause();

    await token.connect(admin).transfer(user1.address, amount);
    expect(await token.balanceOf(user1.address)).to.equal(amount);
  });

  it("burn reduces balance and totalSupply", async () => {
    const amount = ethers.parseEther("10");
    await token.connect(admin).mint(user1.address, amount);

    await token.connect(user1).burn(amount);

    expect(await token.balanceOf(user1.address)).to.equal(0);
    expect(await token.totalSupply()).to.equal(0);
  });
});
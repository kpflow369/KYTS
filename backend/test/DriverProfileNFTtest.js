const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DriverProfileNFT", function () {
  let DriverProfileNFT, profile;
  let admin, driver, other;

  beforeEach(async () => {
    [admin, driver, other] = await ethers.getSigners();
    DriverProfileNFT = await ethers.getContractFactory("DriverProfileNFT");
    profile = await DriverProfileNFT.deploy(admin.address);
    await profile.waitForDeployment();
  });

  it("admin has DEFAULT_ADMIN_ROLE and MINTER_ROLE", async () => {
    const DEFAULT_ADMIN_ROLE = await profile.DEFAULT_ADMIN_ROLE();
    const MINTER_ROLE = await profile.MINTER_ROLE();

    expect(await profile.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.equal(true);
    expect(await profile.hasRole(MINTER_ROLE, admin.address)).to.equal(true);
  });

  it("mints one profile per driver and sets URI", async () => {
    const uri = "ipfs://driver-1";
    const tx = await profile.connect(admin).mintProfile(driver.address, uri);
    await tx.wait();

    const tokenId = await profile.profileTokenOf(driver.address);
    expect(tokenId).to.equal(1n);
    expect(await profile.ownerOf(tokenId)).to.equal(driver.address);
    expect(await profile.tokenURI(tokenId)).to.equal(uri);
  });

  it("prevents second profile for same driver", async () => {
    const uri = "ipfs://driver-1";
    await profile.connect(admin).mintProfile(driver.address, uri);

    await expect(
      profile.connect(admin).mintProfile(driver.address, "ipfs://other")
    ).to.be.revertedWithCustomError(profile, "ProfileAlreadyExists");
  });

  it("is non-transferable", async () => {
    const uri = "ipfs://driver-1";
    await profile.connect(admin).mintProfile(driver.address, uri);
    const tokenId = await profile.profileTokenOf(driver.address);

    await expect(
      profile.connect(driver).transferFrom(driver.address, other.address, tokenId)
    ).to.be.revertedWithCustomError(profile, "NonTransferable");
  });
});
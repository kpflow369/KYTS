const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GreenDeliveryNFT", function () {
  let GreenNFT, nft, admin, user;

  beforeEach(async () => {
    [admin, user] = await ethers.getSigners();
    GreenNFT = await ethers.getContractFactory("GreenDeliveryNFT");
    nft = await GreenNFT.deploy(admin.address);
    await nft.waitForDeployment();
  });

  it("admin has DEFAULT_ADMIN_ROLE and MINTER_ROLE", async () => {
    const DEFAULT_ADMIN_ROLE = await nft.DEFAULT_ADMIN_ROLE();
    const MINTER_ROLE = await nft.MINTER_ROLE();

    expect(await nft.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.equal(true);
    expect(await nft.hasRole(MINTER_ROLE, admin.address)).to.equal(true);
  });

  it("minter can mint and tokenURI is set", async () => {
    const uri = "ipfs://some-metadata";
    const tx = await nft.connect(admin).mint(user.address, uri);
    const receipt = await tx.wait();
    const tokenId = 1n; // first mint since _nextId starts at 0

    expect(await nft.ownerOf(tokenId)).to.equal(user.address);
    expect(await nft.tokenURI(tokenId)).to.equal(uri);
  });

  it("non-minter cannot mint", async () => {
    await expect(
      nft.connect(user).mint(user.address, "uri")
    ).to.be.reverted; // AccessControl revert
  });
});
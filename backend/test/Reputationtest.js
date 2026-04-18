const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Reputation", function () {
  let Reputation, rep;
  let admin, updater, random;

  beforeEach(async () => {
    [admin, updater, random] = await ethers.getSigners();

    Reputation = await ethers.getContractFactory("Reputation");
    rep = await Reputation.deploy(admin.address);
    await rep.waitForDeployment();

    // grant UPDATER_ROLE to updater for tests
    const UPDATER_ROLE = await rep.UPDATER_ROLE();
    await rep.connect(admin).grantRole(UPDATER_ROLE, updater.address);
  });

  it("sets roles correctly", async () => {
    const DEFAULT_ADMIN_ROLE = await rep.DEFAULT_ADMIN_ROLE();
    const UPDATER_ROLE = await rep.UPDATER_ROLE();

    expect(await rep.hasRole(DEFAULT_ADMIN_ROLE, admin.address)).to.equal(true);
    expect(await rep.hasRole(UPDATER_ROLE, admin.address)).to.equal(true);
    expect(await rep.hasRole(UPDATER_ROLE, updater.address)).to.equal(true);
  });

  it("allows updater to add rating", async () => {
    await rep.connect(updater).addDriverRating(random.address, 5);
    const stats = await rep.driverStats(random.address);

    expect(stats.totalRating).to.equal(5n);
    expect(stats.ratingCount).to.equal(1n);
  });

  it("prevents non-updater from adding rating", async () => {
    await expect(
      rep.connect(random).addDriverRating(random.address, 5)
    ).to.be.reverted; // AccessControl revert
  });

  it("reverts on invalid rating", async () => {
    await expect(
      rep.connect(updater).addDriverRating(random.address, 0)
    ).to.be.revertedWith("Bad rating");

    await expect(
      rep.connect(updater).addDriverRating(random.address, 6)
    ).to.be.revertedWith("Bad rating");
  });

  it("computes average correctly (scaled)", async () => {
    // ratings: 5 and 3 => avg = 4
    await rep.connect(updater).addDriverRating(random.address, 5);
    await rep.connect(updater).addDriverRating(random.address, 3);

    const avg = await rep.getAverage(random.address);
    const expected = 4n * 10n ** 18n;

    expect(avg).to.equal(expected);
  });

  it("average is 0 when no ratings", async () => {
    const avg = await rep.getAverage(random.address);
    expect(avg).to.equal(0n);
  });
});
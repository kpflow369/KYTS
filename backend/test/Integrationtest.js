it("adds driver and mints profile SBT", async () => {
  // deploy full stack (you can reuse your existing integration setup)
  // assume marketplace + driverProfile are deployed and roles wired

  const [admin, driver] = await ethers.getSigners();

  // before: driver has no profile
  expect(await driverProfile.profileTokenOf(driver.address)).to.equal(0n);

  const uri = "ipfs://driver-1";
  await marketplace.connect(admin).addDriver(driver.address, uri);

  expect(await marketplace.isDriver(driver.address)).to.equal(true);

  const tokenId = await driverProfile.profileTokenOf(driver.address);
  expect(tokenId).to.equal(1n);
  expect(await driverProfile.ownerOf(tokenId)).to.equal(driver.address);
  expect(await driverProfile.tokenURI(tokenId)).to.equal(uri);

  // check non-transferable at integration level
  await expect(
    driverProfile.connect(driver).transferFrom(driver.address, admin.address, tokenId)
  ).to.be.revertedWithCustomError(driverProfile, "NonTransferable");
});
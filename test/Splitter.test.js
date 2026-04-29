const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Splitter", function () {

  let splitter, owner, artist1, artist2, artist3;

  // Runs before each test — deploys a fresh contract
  beforeEach(async function () {

    // Get test wallets from Hardhat
    [owner, artist1, artist2, artist3] = await ethers.getSigners();

    // Deploy the contract with 3 artists
    const Splitter = await ethers.getContractFactory("Splitter");

    splitter = await Splitter.deploy(
      [artist1.address, artist2.address, artist3.address],
      [40, 30, 30]
    );

    await splitter.waitForDeployment();
  });

  it("should split payment correctly between artists", async function () {

    // Send 1 ETH to the contract
    await owner.sendTransaction({
      to: await splitter.getAddress(),
      value: ethers.parseEther("1")
    });

    // Get artist balances from contract
    const a1 = await splitter.artists(0);
    const a2 = await splitter.artists(1);
    const a3 = await splitter.artists(2);

    // Check distribution
    expect(a1[2]).to.equal(ethers.parseEther("0.4"));
    expect(a2[2]).to.equal(ethers.parseEther("0.3"));
    expect(a3[2]).to.equal(ethers.parseEther("0.3"));
  });

  it("should reject deployment if percentages don't add to 100", async function () {

    const Splitter = await ethers.getContractFactory("Splitter");

    await expect(
      Splitter.deploy(
        [artist1.address, artist2.address, artist3.address],
        [50, 30, 10] // total = 90 ❌
      )
    ).to.be.revertedWith("Total must be 100%");
  });

  it("should store and retrieve a product CID", async function () {

    // Register product
    await splitter.registerProduct("QmTestCID123", ethers.parseEther("1"));

    // Retrieve product
    const product = await splitter.getProduct(0);

    // Validate CID
    expect(product[0]).to.equal("QmTestCID123");
  });

});
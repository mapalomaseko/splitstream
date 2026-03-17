// ============================================================
// STUDENT 1 — CONTRACT TESTS
// ============================================================
// Run with: npx hardhat test
//
// TASKS:
// [ ] Write a test that deploys Splitter with 3 artists (40/30/30 split)
// [ ] Write a test that sends 1 ETH and checks each artist received the right amount
// [ ] Write a test that tries to deploy with percentages != 100 and expects a revert
// [ ] Write a test that registers a product CID and reads it back
// ============================================================

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Splitter", function () {

  // Runs before each test — deploys a fresh contract
  beforeEach(async function () {
    // TODO: Get test wallets from Hardhat
    // [owner, artist1, artist2, artist3] = await ethers.getSigners();

    // TODO: Deploy the contract with 3 artists
    // const Splitter = await ethers.getContractFactory("Splitter");
    // splitter = await Splitter.deploy([artist1.address, artist2.address, artist3.address], [40, 30, 30]);
  });

  it("should split payment correctly between artists", async function () {
    // TODO: Send 1 ETH to the contract
    // TODO: Check artist1 received 0.4 ETH, artist2 got 0.3 ETH, artist3 got 0.3 ETH
    expect(true).to.equal(true); // placeholder — replace this
  });

  it("should reject deployment if percentages don't add to 100", async function () {
    // TODO: Try deploying with [50, 30, 10] (adds to 90) and expect it to revert
    expect(true).to.equal(true); // placeholder — replace this
  });

  it("should store and retrieve a product CID", async function () {
    // TODO: Call registerProduct("QmTestCID123")
    // TODO: Read it back and confirm it matches
    expect(true).to.equal(true); // placeholder — replace this
  });

});

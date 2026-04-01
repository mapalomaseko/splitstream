// ============================================================
// STUDENT 3 OWNS THIS FILE
// ============================================================
// Hardhat configuration — tells Hardhat where to deploy,
// which Solidity version to use, and how to find your wallet.
//
// TASKS FOR STUDENT 3:
// [ ] Confirm the Solidity version matches what Student 1 uses in contracts
// [ ] Add the Sepolia network config in Week 2 (Day 11)
// [ ] Never hardcode private keys here — always use process.env.PRIVATE_KEY
// ============================================================

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",

  networks: {
    // Local network — runs on your machine with: npx hardhat node
    localhost: {
      url: "http://127.0.0.1:8545",
    },

      sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};

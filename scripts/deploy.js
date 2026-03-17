// ============================================================
// STUDENT 3 — DEPLOYMENT SCRIPT
// ============================================================
// Deploys Splitter.sol to the network specified in the command.
//
// TASKS:
// [ ] Fill in the real artist wallet addresses below before deploying
// [ ] Confirm percentages add up to exactly 100
// [ ] After deployment, copy the contract address to .env
// [ ] Distribute the new ABI to Students 2 and 4
// [ ] For Sepolia: post the Etherscan link in team chat
//
// HOW THE ABI IS GENERATED:
// When you run this script, Hardhat auto-compiles first.
// The ABI appears at: artifacts/contracts/Splitter.sol/Splitter.json
// That file is what Students 2 and 4 import into the frontend.
// ============================================================

const hre = require("hardhat");

async function main() {

  console.log("Deploying Splitter contract...");

  // ⚠️ REPLACE THESE with your team's actual test wallet addresses
  // Get them from MetaMask > click account name > copy address
  const artistAddresses = [
    "0xArtist1WalletAddressHere",
    "0xArtist2WalletAddressHere",
    "0xArtist3WalletAddressHere",
  ];

  // Must add up to 100
  const percentages = [40, 30, 30];

  // Deploy
  const Splitter = await hre.ethers.getContractFactory("Splitter");
  const splitter = await Splitter.deploy(artistAddresses, percentages);
  await splitter.waitForDeployment();

  const address = await splitter.getAddress();

  console.log("✅ Splitter deployed to:", address);
  console.log("👉 Copy this address into your .env as NEXT_PUBLIC_CONTRACT_ADDRESS");
  console.log("👉 Share the ABI at: artifacts/contracts/Splitter.sol/Splitter.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

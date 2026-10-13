// Hardhat configuration. Secrets are read from the root .env file (see .env.example).
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",

  networks: {
    // Local network — start it with: npm run node
    localhost: {
      url: "http://127.0.0.1:8545",
    },

    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      // Left empty when PRIVATE_KEY is unset so compile/test work without a .env
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};

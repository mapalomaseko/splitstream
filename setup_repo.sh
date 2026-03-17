#!/bin/bash
# ============================================================
#  Blockchain Art Platform — Repo Skeleton Setup Script
#  Run this ONCE inside your cloned GitHub repo folder:
#
#  1. Clone your repo:   git clone https://github.com/YOUR_TEAM/YOUR_REPO.git
#  2. Enter it:          cd YOUR_REPO
#  3. Run this script:   bash setup_repo.sh
#  4. Push everything:   git add . && git commit -m "scaffold: initial repo structure" && git push
# ============================================================

echo "🔧 Setting up Blockchain Art Platform repo structure..."

# ────────────────────────────────────────────────────────────
# ROOT FILES
# ────────────────────────────────────────────────────────────

cat > README.md << 'EOF'
# Blockchain Art Platform

A decentralized marketplace for digital art with automatic revenue splitting.

## What This Project Does
Artists upload digital work. Buyers pay in ETH. The smart contract automatically
splits the payment between all artists instantly — no middleman, no trust required.

## Team
| Role | Student | Owns |
|------|---------|------|
| Smart Contract Developer | Student 1 | /contracts |
| Wallet & Transaction Lead | Student 2 | /frontend/context |
| Infrastructure & DevOps | Student 3 | /scripts, hardhat.config.js |
| UI/UX & IPFS Lead | Student 4 | /frontend/pages, /frontend/components |

## Quick Start
```bash
# 1. Install dependencies
npm install
cd frontend && npm install

# 2. Copy environment variables
cp .env.example .env
# Fill in your own values in .env

# 3. Start local blockchain
npx hardhat node

# 4. Deploy contract (in a new terminal)
npx hardhat run scripts/deploy.js --network localhost

# 5. Start frontend (in a new terminal)
cd frontend && npm run dev
```

## The Integration Order (follow this strictly)
1. Student 1 writes/updates contract → tells Student 3
2. Student 3 compiles → shares new ABI with Students 2 and 4
3. Student 2 writes JS functions using the ABI
4. Student 4 attaches those functions to UI buttons

## ⚠️ Rules
- NEVER commit your .env file — it contains your private key
- Every time a contract changes, the ABI MUST be redistributed (Student 3's job)
- All work goes to main — communicate before pushing to avoid conflicts
EOF

cat > .env.example << 'EOF'
# ============================================================
# COPY THIS FILE TO .env AND FILL IN YOUR VALUES
# NEVER commit the real .env file to GitHub
# ============================================================

# Your wallet private key (from MetaMask > Account Details > Export Private Key)
# This is used by Hardhat to deploy contracts — use a TESTING wallet only, never your main wallet
PRIVATE_KEY=your_private_key_here

# Sepolia RPC URL — get a free one from Alchemy (alchemy.com) or Infura (infura.io)
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_api_key_here

# Pinata API Keys — get from app.pinata.cloud > API Keys
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_KEY=your_pinata_secret_key_here

# Contract address — Student 3 fills this in AFTER deploying to Sepolia
# Leave blank until deployment
NEXT_PUBLIC_CONTRACT_ADDRESS=

# Which network the frontend talks to: "localhost" or "sepolia"
NEXT_PUBLIC_NETWORK=localhost
EOF

cat > .gitignore << 'EOF'
# Environment variables — NEVER commit this
.env

# Dependencies
node_modules/
frontend/node_modules/

# Hardhat build artifacts (auto-generated — do not edit manually)
artifacts/
cache/

# Next.js build output
frontend/.next/
frontend/out/

# OS files
.DS_Store
Thumbs.db

# Editor files
.vscode/settings.json
.idea/

# Test coverage reports
coverage/
EOF

cat > hardhat.config.js << 'EOF'
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

    // Sepolia testnet — uncomment and fill in .env before using (Week 2)
    // sepolia: {
    //   url: process.env.SEPOLIA_RPC_URL,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
  },
};
EOF

cat > package.json << 'EOF'
{
  "name": "blockchain-art-platform",
  "version": "1.0.0",
  "description": "Decentralized art marketplace with automatic revenue splitting",
  "scripts": {
    "compile": "npx hardhat compile",
    "test": "npx hardhat test",
    "deploy:local": "npx hardhat run scripts/deploy.js --network localhost",
    "deploy:sepolia": "npx hardhat run scripts/deploy.js --network sepolia",
    "node": "npx hardhat node"
  },
  "devDependencies": {
    "@nomicfoundation/hardhat-toolbox": "^4.0.0",
    "hardhat": "^2.19.0",
    "dotenv": "^16.0.0"
  }
}
EOF

# ────────────────────────────────────────────────────────────
# CONTRACTS — Student 1
# ────────────────────────────────────────────────────────────
mkdir -p contracts

cat > contracts/README.md << 'EOF'
# /contracts — Student 1

This folder contains all Solidity smart contracts.
Student 1 writes and maintains everything here.

## Files
| File | Status | Description |
|------|--------|-------------|
| HelloWorld.sol | Week 1 practice | First contract — just a string variable. Used to test the deploy pipeline. Delete before final demo. |
| Splitter.sol | Main deliverable | The real contract. Holds artist addresses, splits incoming ETH payments automatically. |

## Every Time You Change a Contract
1. Tell Student 3 immediately
2. Student 3 runs: npx hardhat compile
3. Student 3 shares the new ABI from /artifacts/ with Students 2 and 4
4. Students 2 and 4 update their imports

## Solidity Version
Always match the version in hardhat.config.js (currently 0.8.20)
EOF

cat > contracts/HelloWorld.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================================
// STUDENT 1 — WEEK 1 PRACTICE CONTRACT
// ============================================================
// Purpose: Test that the full pipeline works.
//          Deploy this first to confirm Student 3's setup is correct.
//
// TASKS:
// [ ] Deploy this to the local Hardhat network (Student 3 does the deploy)
// [ ] Confirm Student 2 can READ the 'message' variable from the frontend
// [ ] Delete this file before the final demo — it's just for practice
// ============================================================

contract HelloWorld {
    // A public variable — anyone can read this from the frontend
    string public message = "The blockchain art platform is alive!";

    // A function to update the message (good practice for write transactions)
    function setMessage(string memory _newMessage) public {
        message = _newMessage;
    }
}
EOF

cat > contracts/Splitter.sol << 'EOF'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================================
// STUDENT 1 — MAIN DELIVERABLE
// ============================================================
// Purpose: Accept ETH payments and automatically split them
//          between registered artists based on their percentages.
//
// WEEK 1 TASKS:
// [ ] Define the Artist struct (address + percentage)
// [ ] Write the constructor to set up the artists array
// [ ] Add the receive() function so the contract can accept ETH
// [ ] Write distribute() — loops over artists, sends each their share
//
// WEEK 2 TASKS:
// [ ] Add a products mapping: productId => CID string
// [ ] Write registerProduct(string cid) — stores CID on-chain
// [ ] Write getArtistBalance(address) — so the dashboard can read balances
// [ ] Write tests in /test/Splitter.test.js for every function
//
// KEY CONCEPT — distribute() logic:
//   share = (msg.value * artist.percentage) / 100
//   payable(artist.wallet).transfer(share)
//
// ⚠️  IMPORTANT: Percentages must add up to exactly 100.
//     Add a check in the constructor that reverts if they don't.
// ============================================================

contract Splitter {

    // TODO: Define Artist struct here
    // struct Artist {
    //     address payable wallet;
    //     uint256 percentage;
    // }

    // TODO: Declare artists array here

    // TODO: Declare products mapping here

    // TODO: Write constructor here

    // TODO: Write registerProduct() here

    // TODO: Write distribute() here

    // TODO: Write receive() here — marks contract as payable
    // receive() external payable {
    //     distribute();
    // }
}
EOF

# ────────────────────────────────────────────────────────────
# TEST — Student 1
# ────────────────────────────────────────────────────────────
mkdir -p test

cat > test/README.md << 'EOF'
# /test — Student 1

Automated tests for the smart contracts.
Run all tests with: npx hardhat test

## Why Tests Matter Here
Once a contract is deployed to a real network it CANNOT be changed.
A bug in the split logic means artists get the wrong amount — forever.
Tests catch this before deployment.

## Files
| File | Tests |
|------|-------|
| Splitter.test.js | distribute(), registerProduct(), percentage validation |

## What to Test (minimum)
- [ ] Correct ETH amount reaches each artist after distribute()
- [ ] percentages that don't add to 100 are rejected at deploy time
- [ ] registerProduct() stores the CID and can be read back
- [ ] Contract reverts if called with 0 ETH
EOF

cat > test/Splitter.test.js << 'EOF'
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
EOF

# ────────────────────────────────────────────────────────────
# SCRIPTS — Student 3
# ────────────────────────────────────────────────────────────
mkdir -p scripts

cat > scripts/README.md << 'EOF'
# /scripts — Student 3

Deployment scripts for the smart contracts.

## Files
| File | Purpose |
|------|---------|
| deploy.js | Deploys Splitter.sol to whichever network is specified |

## How to Run
```bash
# Deploy to local Hardhat node (make sure it's running first: npx hardhat node)
npx hardhat run scripts/deploy.js --network localhost

# Deploy to Sepolia testnet (Week 2 — needs .env filled in)
npx hardhat run scripts/deploy.js --network sepolia
```

## After Every Deployment
1. Copy the contract address printed in the terminal
2. Paste it into .env as NEXT_PUBLIC_CONTRACT_ADDRESS
3. Copy the new ABI from /artifacts/contracts/Splitter.sol/Splitter.json
4. Share the ABI file path with Students 2 and 4
5. Post the Etherscan link in the team chat (Sepolia deploys only)
EOF

cat > scripts/deploy.js << 'EOF'
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
EOF

# ────────────────────────────────────────────────────────────
# FRONTEND — Students 2 and 4
# ────────────────────────────────────────────────────────────
mkdir -p frontend/pages
mkdir -p frontend/components
mkdir -p frontend/context
mkdir -p frontend/styles
mkdir -p frontend/utils
mkdir -p frontend/abi

cat > frontend/README.md << 'EOF'
# /frontend — Students 2 and 4

The Next.js web application. This is everything the user sees and clicks.

## Ownership
| Folder | Owner |
|--------|-------|
| /pages | Student 4 |
| /components | Student 4 (UI) + Student 2 (ConnectWallet logic) |
| /context/Web3Context.js | Student 2 |
| /utils/contractHelpers.js | Student 2 |
| /abi/ | Student 3 updates, Students 2+4 read |
| /styles | Student 4 |

## How to Run
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:3000
```

## Environment Variables
The frontend reads from the root .env file.
Any variable the browser needs must be prefixed with NEXT_PUBLIC_
Example: NEXT_PUBLIC_CONTRACT_ADDRESS
EOF

cat > frontend/package.json << 'EOF'
{
  "name": "blockchain-art-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "ethers": "^6.0.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.0.0"
  }
}
EOF

# ABI placeholder
cat > frontend/abi/README.md << 'EOF'
# /frontend/abi — Managed by Student 3

This folder holds the ABI (Application Binary Interface) for the smart contract.
Think of it as the instruction manual that tells the frontend how to talk to the contract.

## What is an ABI?
After Student 1 writes a contract and Student 3 compiles it,
Hardhat generates a JSON file describing every function and its inputs.
Without this file, the frontend has no idea what to call on the contract.

## Files
| File | Description |
|------|-------------|
| Splitter.json | The ABI for Splitter.sol — copy from artifacts/contracts/Splitter.sol/Splitter.json after every compile |

## Workflow (Student 3)
1. Student 1 changes Splitter.sol → tells you
2. You run: npx hardhat compile
3. You copy: artifacts/contracts/Splitter.sol/Splitter.json → frontend/abi/Splitter.json
4. You commit and push
5. You tell Students 2 and 4 the ABI has been updated

## ⚠️ Stale ABI = Silent Bugs
If the frontend uses an old ABI after the contract changes,
function calls will fail or send wrong data — and the error messages won't make it obvious why.
Always update this file after every contract change.
EOF

cat > frontend/abi/Splitter.json << 'EOF'
[]
EOF
# Note: This will be replaced by Student 3 after the first compile.
# The empty array above is just a placeholder so the file exists.

# Web3Context
cat > frontend/context/Web3Context.js << 'EOF'
// ============================================================
// STUDENT 2 — WALLET CONNECTION CONTEXT
// ============================================================
// This file manages the wallet connection state for the entire app.
// Any component that needs the wallet address or provider imports from here.
//
// WEEK 1 TASKS:
// [ ] Write connectWallet() — calls window.ethereum.request({ method: 'eth_requestAccounts' })
// [ ] Store the wallet address in React state with useState
// [ ] Export walletAddress and connectWallet so other components can use them
// [ ] Test that clicking Connect Wallet shows the address on screen
//
// WEEK 2 TASKS:
// [ ] Write buyProduct(productId, priceInEth) — triggers MetaMask payment popup
// [ ] Write registerProduct(cid, priceInEth) — stores CID on the contract
// [ ] Write getArtistBalance(address) — reads balance from contract (no gas needed)
// [ ] Add error handling for: user rejects MetaMask, wrong network, no MetaMask installed
//
// HOW TO USE IN OTHER COMPONENTS:
//   import { useWeb3 } from '../context/Web3Context'
//   const { walletAddress, connectWallet } = useWeb3()
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Splitter from '../abi/Splitter.json';

const Web3Context = createContext();

export function Web3Provider({ children }) {

  const [walletAddress, setWalletAddress] = useState('');
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);

  // TODO: Write connectWallet function
  const connectWallet = async () => {
    // Check MetaMask is installed
    // if (!window.ethereum) { alert("Please install MetaMask"); return; }
    //
    // Request account access
    // const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    // setWalletAddress(accounts[0]);
    //
    // Set up Ethers provider and contract instance
    // const _provider = new ethers.BrowserProvider(window.ethereum);
    // const _signer = await _provider.getSigner();
    // const _contract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, Splitter, _signer);
    // setProvider(_provider);
    // setContract(_contract);
  };

  // TODO: Write registerProduct function (Week 2)
  const registerProduct = async (cid, priceInEth) => {
    // if (!contract) { alert("Connect wallet first"); return; }
    // const tx = await contract.registerProduct(cid, ethers.parseEther(priceInEth));
    // await tx.wait(); // waits for blockchain confirmation
    // return tx.hash;
  };

  // TODO: Write buyProduct function (Week 2)
  const buyProduct = async (productId, priceInEth) => {
    // if (!contract) { alert("Connect wallet first"); return; }
    // const tx = await contract.buyProduct(productId, {
    //   value: ethers.parseEther(priceInEth)
    // });
    // await tx.wait();
    // return tx.hash;
  };

  // TODO: Write getArtistBalance function (Week 2)
  const getArtistBalance = async (address) => {
    // if (!contract) return "0";
    // const balance = await contract.getArtistBalance(address);
    // return ethers.formatEther(balance);
  };

  return (
    <Web3Context.Provider value={{
      walletAddress,
      connectWallet,
      registerProduct,
      buyProduct,
      getArtistBalance,
    }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}
EOF

# contractHelpers
cat > frontend/utils/contractHelpers.js << 'EOF'
// ============================================================
// STUDENT 2 — UTILITY HELPERS
// ============================================================
// Small helper functions used across the app.
// These are pure JS utilities — no React, no blockchain calls.
//
// TASKS:
// [ ] Write formatAddress() — shortens 0x1234...5678 for display
// [ ] Write formatEth() — converts wei to readable ETH string
// [ ] Write isValidAddress() — checks if a string is a valid ETH address
// ============================================================

import { ethers } from 'ethers';

// Shortens a wallet address for display: 0x1234...5678
export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Converts ETH string to Wei (for sending transactions)
export function toWei(ethAmount) {
  return ethers.parseEther(ethAmount.toString());
}

// Converts Wei to ETH string (for displaying balances)
export function fromWei(weiAmount) {
  return ethers.formatEther(weiAmount);
}

// Checks if a string is a valid Ethereum address
export function isValidAddress(address) {
  return ethers.isAddress(address);
}
EOF

# Pages
cat > frontend/pages/_app.js << 'EOF'
// ============================================================
// STUDENT 4 — APP WRAPPER
// ============================================================
// This wraps every page with the Web3Provider so all pages
// have access to the wallet connection state.
//
// TASKS:
// [ ] Confirm Web3Provider is imported correctly
// [ ] Import global CSS
// ============================================================

import { Web3Provider } from '../context/Web3Context';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <Web3Provider>
      <Component {...pageProps} />
    </Web3Provider>
  );
}
EOF

cat > frontend/pages/index.js << 'EOF'
// ============================================================
// STUDENT 4 — PAGE 1: LANDING PAGE
// ============================================================
// The first thing visitors see. Explains the platform and
// prompts them to connect their wallet.
//
// TASKS:
// [ ] Build the hero section: headline, subheading, CTA button
// [ ] Add the ConnectWallet component
// [ ] Add navigation links to /marketplace and /upload
// [ ] Style with Tailwind CSS
// [ ] Show connected wallet address if already connected
// ============================================================

import Head from 'next/head';
import ConnectWallet from '../components/ConnectWallet';

export default function Home() {
  return (
    <>
      <Head>
        <title>Blockchain Art Platform</title>
      </Head>

      <main className="min-h-screen bg-gray-900 text-white">

        {/* TODO: Build navigation bar */}

        {/* TODO: Build hero section */}
        <section>
          <h1>Own Art. Split Revenue. No Middleman.</h1>
          <p>TODO: Add subheading explaining the platform</p>
          <ConnectWallet />
        </section>

        {/* TODO: Add feature highlights section */}

        {/* TODO: Add links to marketplace and upload */}

      </main>
    </>
  );
}
EOF

cat > frontend/pages/upload.js << 'EOF'
// ============================================================
// STUDENT 4 — PAGE 2: CREATOR UPLOAD
// ============================================================
// Artists use this page to upload their work and register it on-chain.
//
// THE FULL FLOW THIS PAGE HANDLES:
// 1. Artist fills in title, price, and selects a file
// 2. Artist clicks Upload
// 3. File is sent to Pinata → Pinata returns a CID
// 4. CID + price is sent to the smart contract via registerProduct()
// 5. MetaMask pops up for the artist to confirm
// 6. Success message shown with transaction hash
//
// WEEK 1 TASKS:
// [ ] Build the form UI (title, price, file input, submit button)
// [ ] Set up Pinata SDK (npm install @pinata/sdk)
// [ ] Upload a test file manually and log the CID to console
//
// WEEK 2 TASKS:
// [ ] Connect the Upload button to Pinata upload function
// [ ] After getting CID, call registerProduct() from Web3Context
// [ ] Show loading state while transaction confirms
// [ ] Show success state with Etherscan link after confirmation
// ============================================================

import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

export default function Upload() {
  const { walletAddress, connectWallet, registerProduct } = useWeb3();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | confirming | success | error

  const handleUpload = async () => {
    // TODO: Validate inputs
    // TODO: Upload file to Pinata and get CID
    // TODO: Call registerProduct(cid, price)
    // TODO: Update status states throughout
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <h1>Upload Your Artwork</h1>

      {/* TODO: Show connect wallet prompt if not connected */}

      {/* TODO: Build the upload form */}
      <div>
        <input placeholder="Artwork Title" onChange={e => setTitle(e.target.value)} />
        <input placeholder="Price in ETH" onChange={e => setPrice(e.target.value)} />
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Upload & Register</button>
      </div>

      {/* TODO: Show status messages */}
      {status === 'success' && <p>Successfully registered on-chain!</p>}
    </main>
  );
}
EOF

cat > frontend/pages/marketplace.js << 'EOF'
// ============================================================
// STUDENT 4 — PAGE 3: MARKETPLACE + ARTIST DASHBOARD
// ============================================================
// Two things happen on this page:
// A. Buyers see listed artworks and can purchase them
// B. Artists see their pending balance (read directly from contract)
//
// WEEK 1 TASKS:
// [ ] Build the page layout with placeholder product cards
// [ ] Add the artist dashboard section (can show dummy data for now)
//
// WEEK 2 TASKS:
// [ ] Load real products from the smart contract (not dummy data)
// [ ] Wire the Buy button to buyProduct() from Web3Context
// [ ] Show MetaMask confirmation flow with loading state
// [ ] Artist dashboard: call getArtistBalance() and display live balance
// [ ] Show transaction hash link to Etherscan after purchase
//
// ⚠️ IMPORTANT: Artist balance MUST come from the contract,
//    not from a local variable. This proves the split happened on-chain.
// ============================================================

import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';

export default function Marketplace() {
  const { walletAddress, buyProduct, getArtistBalance } = useWeb3();

  const [products, setProducts] = useState([]);
  const [artistBalance, setArtistBalance] = useState('0');

  useEffect(() => {
    // TODO: Load products from the contract when the page loads
  }, []);

  useEffect(() => {
    // TODO: Load artist balance when wallet connects
    if (walletAddress) {
      // getArtistBalance(walletAddress).then(setArtistBalance);
    }
  }, [walletAddress]);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">

      {/* Artist Dashboard */}
      <section>
        <h2>Artist Dashboard</h2>
        <p>Your Pending Balance: {artistBalance} ETH</p>
        {/* TODO: Style this as a proper dashboard card */}
      </section>

      {/* Product Listings */}
      <section>
        <h2>Available Artworks</h2>
        {/* TODO: Map over products and render a card for each */}
        {products.length === 0 && <p>No artworks listed yet.</p>}
      </section>

    </main>
  );
}
EOF

# Components
cat > frontend/components/README.md << 'EOF'
# /frontend/components — Students 2 and 4

Reusable UI pieces used across multiple pages.

## Files
| File | Owner | Purpose |
|------|-------|---------|
| ConnectWallet.js | S2 (logic) + S4 (style) | Button that triggers MetaMask + shows connected address |
| ProductCard.js | Student 4 | Displays a single artwork with title, price, Buy button |
| Navbar.js | Student 4 | Navigation across all 3 pages |
| StatusMessage.js | Student 4 | Reusable loading/success/error message component |
EOF

cat > frontend/components/ConnectWallet.js << 'EOF'
// ============================================================
// STUDENTS 2 (logic) + 4 (styling) — CONNECT WALLET BUTTON
// ============================================================
// Used on the Landing Page and Navbar.
//
// TASKS FOR STUDENT 2:
// [ ] Import useWeb3 and pull out walletAddress and connectWallet
// [ ] Wire the button's onClick to connectWallet()
// [ ] Handle the case where MetaMask is not installed
//
// TASKS FOR STUDENT 4:
// [ ] Style with Tailwind — button should look different when connected vs disconnected
// [ ] When connected: show shortened address (use formatAddress from utils/contractHelpers.js)
// [ ] When disconnected: show "Connect Wallet" text
// ============================================================

import { useWeb3 } from '../context/Web3Context';
import { formatAddress } from '../utils/contractHelpers';

export default function ConnectWallet() {
  const { walletAddress, connectWallet } = useWeb3();

  return (
    <button
      onClick={connectWallet}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {walletAddress ? formatAddress(walletAddress) : 'Connect Wallet'}
    </button>
  );
}
EOF

cat > frontend/components/ProductCard.js << 'EOF'
// ============================================================
// STUDENT 4 — PRODUCT CARD COMPONENT
// ============================================================
// Displays a single artwork listing on the Marketplace page.
//
// TASKS:
// [ ] Display: artwork title, price in ETH, IPFS image via Pinata gateway
// [ ] Buy button calls buyProduct() from Web3Context
// [ ] Show loading state while transaction confirms
// [ ] Show success message with Etherscan link after purchase
//
// HOW TO DISPLAY THE IMAGE:
//   Use the Pinata gateway: https://gateway.pinata.cloud/ipfs/{cid}
// ============================================================

import { useWeb3 } from '../context/Web3Context';

export default function ProductCard({ productId, title, price, cid }) {
  const { buyProduct } = useWeb3();

  const handleBuy = async () => {
    // TODO: Call buyProduct(productId, price)
    // TODO: Handle loading and success states
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {/* TODO: Display image from Pinata gateway using cid */}
      <img
        src={cid ? `https://gateway.pinata.cloud/ipfs/${cid}` : '/placeholder.png'}
        alt={title}
        className="w-full h-48 object-cover rounded"
      />
      <h3>{title || 'Untitled'}</h3>
      <p>{price} ETH</p>
      <button onClick={handleBuy}>Buy Now</button>
    </div>
  );
}
EOF

cat > frontend/components/Navbar.js << 'EOF'
// ============================================================
// STUDENT 4 — NAVIGATION BAR
// ============================================================
// Appears on every page. Contains links + ConnectWallet button.
//
// TASKS:
// [ ] Links to: / (Home), /marketplace, /upload
// [ ] Include ConnectWallet component on the right side
// [ ] Highlight the current active page
// [ ] Make it responsive (mobile-friendly with Tailwind)
// ============================================================

import Link from 'next/link';
import ConnectWallet from './ConnectWallet';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex gap-6">
        <Link href="/">Home</Link>
        <Link href="/marketplace">Marketplace</Link>
        <Link href="/upload">Upload</Link>
      </div>
      <ConnectWallet />
    </nav>
  );
}
EOF

cat > frontend/components/StatusMessage.js << 'EOF'
// ============================================================
// STUDENT 4 — STATUS MESSAGE COMPONENT
// ============================================================
// Reusable component for showing transaction states.
// Used on the Upload and Marketplace pages.
//
// TASKS:
// [ ] Handle 4 states: loading, success, error, idle
// [ ] For success: show a link to Etherscan using the txHash
// [ ] For error: show a human-readable message (not raw error object)
//
// USAGE:
//   <StatusMessage status="loading" message="Uploading to IPFS..." />
//   <StatusMessage status="success" message="Registered!" txHash="0x123..." />
//   <StatusMessage status="error" message="Transaction rejected." />
// ============================================================

export default function StatusMessage({ status, message, txHash }) {
  if (status === 'idle') return null;

  const styles = {
    loading: 'bg-yellow-800 text-yellow-200',
    success: 'bg-green-800 text-green-200',
    error: 'bg-red-800 text-red-200',
  };

  return (
    <div className={`p-4 rounded ${styles[status]}`}>
      <p>{message}</p>
      {txHash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Etherscan →
        </a>
      )}
    </div>
  );
}
EOF

# Styles
cat > frontend/styles/globals.css << 'EOF'
/* ============================================================
   STUDENT 4 — GLOBAL STYLES
   ============================================================
   Tailwind base imports. Add any global overrides below.
   ============================================================ */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* TODO: Add any global custom styles here */
EOF

echo ""
echo "✅ Repo structure created successfully!"
echo ""
echo "📁 Structure created:"
echo "   contracts/         → Student 1"
echo "   test/              → Student 1"
echo "   scripts/           → Student 3"
echo "   frontend/pages/    → Student 4"
echo "   frontend/context/  → Student 2"
echo "   frontend/components/ → Students 2 + 4"
echo "   frontend/abi/      → Student 3 manages"
echo ""
echo "🚀 Next steps:"
echo "   1. git add ."
echo "   2. git commit -m 'scaffold: initial repo structure'"
echo "   3. git push"
echo "   4. Share the repo URL with the team"
echo "   5. Everyone runs: git clone <repo-url>"
echo ""
echo "⚠️  Remind the team: NEVER commit the .env file!"

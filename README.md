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

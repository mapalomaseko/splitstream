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

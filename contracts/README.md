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

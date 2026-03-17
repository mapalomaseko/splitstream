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

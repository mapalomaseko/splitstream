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

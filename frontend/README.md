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

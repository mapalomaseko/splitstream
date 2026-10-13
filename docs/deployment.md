# Deploying to Sepolia

This guide deploys your own `Splitter` contract to Sepolia and points the frontend at it.

## 1. Prepare a test wallet

Create a **new MetaMask account used only for testing**. Never deploy with a wallet that holds real funds, because its private key will sit in a plain-text `.env` file.

Fund it with Sepolia ETH from a faucet. A deployment costs a small fraction of 1 test ETH.

## 2. Get an RPC URL

Create a free app on [Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/) for **Ethereum Sepolia**, and copy its HTTPS URL.

## 3. Configure Hardhat

```bash
cp .env.example .env
```

Fill in:

```dotenv
PRIVATE_KEY=<test wallet private key>
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<your-key>
ARTIST_ADDRESSES=0xAaa...,0xBbb...,0xCcc...
ARTIST_PERCENTAGES=40,30,30
```

Use the payout wallets that should receive each sale. The percentages must line up with the addresses and add up to 100.

## 4. Test and deploy

```bash
npm test
npm run deploy:sepolia
```

The script prints the values the frontend needs:

```
✅ Splitter deployed to: 0x1234...
👉 Set these in frontend/.env:
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234...
   NEXT_PUBLIC_DEPLOY_BLOCK=6543210
   NEXT_PUBLIC_ARTIST_ADDRESSES=0xAaa...,0xBbb...,0xCcc...
```

## 5. Configure the frontend

```bash
cp frontend/.env.example frontend/.env
```

Paste the three values from step 4. Then add a Pinata JWT. In [app.pinata.cloud](https://app.pinata.cloud/), go to **API Keys → New Key** and give the key the `pinFileToIPFS` permission:

```dotenv
PINATA_JWT=<your Pinata JWT>
```

`PINATA_JWT` deliberately has **no** `NEXT_PUBLIC_` prefix. The upload goes through the server route `frontend/app/api/upload/route.js`, so the JWT never reaches the browser.

If you used an older setup with `NEXT_PUBLIC_PINATA_JWT`, rename it to `PINATA_JWT`.

## 6. Run it

```bash
cd frontend
npm run dev
```

Connect MetaMask. Upload a work from one account, then buy it from another. Each payout wallet's balance on Etherscan should go up by its percentage.

## Hosting the frontend publicly

Any host that runs Next.js server routes will work, such as Vercel or Netlify. Set the same `frontend/.env` variables in the host's environment settings.

`/api/upload` has no authentication or rate limiting. On a public deployment, anyone can pin files to your Pinata account through it. Use a Pinata key scoped to `pinFileToIPFS` only, keep an eye on usage, and consider adding wallet-signature checks or rate limiting before sharing the URL widely.

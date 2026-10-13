# Splitter contract reference

Source: [`contracts/Splitter.sol`](../contracts/Splitter.sol) · Solidity `^0.8.20`

`Splitter` combines a product registry with a fixed revenue split. Anyone can register a product, meaning an IPFS CID plus a price. Any ETH the contract receives, whether from a purchase, a direct transfer or a direct `distribute()` call, goes straight out to the payout wallets by their percentages.

## Constructor

```solidity
constructor(address[] memory _artists, uint256[] memory _percentages)
```

- `_artists` and `_percentages` must be the same length. Otherwise it reverts with `"Mismatched inputs"`.
- The percentages must add up to exactly 100. Otherwise it reverts with `"Total must be 100%"`.
- The payout wallets can't be changed after deployment.

## Functions

| Function | Type | Description |
|---|---|---|
| `registerProduct(string cid, uint256 price)` | write | Stores a product with `msg.sender` as creator and emits `ProductRegistered`. IDs start at 0 and increase by one. |
| `buyProduct(uint256 id)` | payable | Requires the product to exist and `msg.value == price`. Splits the payment, then emits `ProductPurchased`. |
| `distribute()` | payable | Splits `msg.value` across the payout wallets and emits `PaymentDistributed`. Also triggered by plain ETH transfers via `receive()`. |
| `getProduct(uint256 id)` | view | Returns `(cid, creator, price)`. |
| `getArtistBalance(address)` | view | Total wei a payout wallet has received so far. Returns 0 for unknown addresses. |
| `products(uint256)` | view | Public mapping getter: `(cid, creator, price)` |
| `productCount()` | view | Number of registered products |
| `artists(uint256)` | view | Public array getter: `(wallet, percentage, totalReceived)` |

Each wallet's share is calculated as `share = msg.value * percentage / 100`.

## Events

| Event | Emitted when |
|---|---|
| `ProductRegistered(uint256 indexed id, string cid, address creator, uint256 price)` | A product is registered |
| `ProductPurchased(uint256 indexed id, address buyer, uint256 amount)` | A purchase succeeds. The frontend builds buyer collections and sales counts from these events. |
| `PaymentDistributed(uint256 totalAmount)` | Any payment is split |

## Revert messages

| Message | Cause |
|---|---|
| `Mismatched inputs` | Constructor arrays have different lengths |
| `Total must be 100%` | Constructor percentages don't add up to 100 |
| `Price must be greater than 0` | `registerProduct` was called with price 0 |
| `Product does not exist` | `buyProduct` was called with an unknown ID |
| `Incorrect price` | `buyProduct` was sent the wrong amount of ETH |
| `No ETH sent` | `distribute` was called with zero value |

## Updating the ABI

The frontend reads the ABI from `frontend/abi/Splitter.json`. After changing the contract:

```bash
npm run compile
cp artifacts/contracts/Splitter.sol/Splitter.json frontend/abi/Splitter.json
```

Then redeploy, and update `NEXT_PUBLIC_CONTRACT_ADDRESS` and `NEXT_PUBLIC_DEPLOY_BLOCK` in `frontend/.env`.

## Known limitations

This contract was built as a learning project and hasn't been audited. Known gaps:

- **Payouts ignore the product's creator.** Every sale is split between the fixed payout wallets chosen at deployment, whoever registered the product.
- **Anyone can register products.** There's no allowlist. The artist dashboard in the frontend is gated on `NEXT_PUBLIC_ARTIST_ADDRESSES`, but that's only a UI check.
- **Purchases don't transfer ownership.** A product can be bought any number of times, and "owning" a work means having a `ProductPurchased` event for it. There are no NFTs.
- **Products can't be edited or delisted.** Hiding a product in the UI (`NEXT_PUBLIC_HIDDEN_PRODUCT_IDS`) doesn't remove it on-chain.
- **`transfer()` forwards only 2300 gas.** If a payout wallet is a smart-contract wallet that needs more gas to receive ETH, every sale will revert.
- **Rounding dust stays in the contract.** If percentages don't divide `msg.value` evenly, the remainder (a few wei) stays in the contract, and nothing can withdraw it.
- **Reads don't scale.** The frontend fetches products one by one, and scans events from the deploy block. That's fine for a demo, but large catalogs would need an indexer.

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

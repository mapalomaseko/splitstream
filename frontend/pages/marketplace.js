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

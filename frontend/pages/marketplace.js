import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import Link from 'next/link';

const DUMMY_PRODUCTS = [
  { id: 1, title: 'Sunset #001', price: '0.05', artist: '0x1234...abcd', image: null },
  { id: 2, title: 'Abstract Wave', price: '0.08', artist: '0x5678...efgh', image: null },
  { id: 3, title: 'Neon Forest', price: '0.12', artist: '0x9abc...ijkl', image: null },
];

export default function Marketplace() {
  const { walletAddress, buyProduct, getArtistBalance } = useWeb3();

  const [products, setProducts] = useState(DUMMY_PRODUCTS);
  const [artistBalance, setArtistBalance] = useState('0');
  const [buyingId, setBuyingId] = useState(null);
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    // Week 2: replace dummy data with real contract call
  }, []);

  useEffect(() => {
    if (walletAddress) {
      // Week 2: uncomment to load real balance
      // getArtistBalance(walletAddress).then(setArtistBalance);
    }
  }, [walletAddress]);

  const handleBuy = async (product) => {
    console.log('Buying:', product.title);
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">

      <nav className="flex justify-between items-center px-10 py-6 border-b border-gray-100">
        <Link href="/" className="font-semibold text-lg tracking-tight">SplitStream</Link>
        <div className="flex items-center gap-8">
          <Link href="/marketplace" className="text-sm text-gray-900 font-medium">Marketplace</Link>
          <Link href="/upload" className="text-sm text-gray-500 hover:text-gray-900">Upload</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">

        {walletAddress && (
          <div className="border border-gray-100 rounded-2xl p-8 mb-16">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Artist Dashboard</p>
            <p className="text-3xl font-semibold tracking-tight mb-1">{artistBalance} ETH</p>
            <p className="text-sm text-gray-400">Pending balance — read directly from the smart contract</p>
          </div>
        )}

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Available artworks</h1>
          <Link href="/upload" className="text-sm border border-gray-200 px-4 py-2 rounded-full hover:border-gray-400">
            + Upload yours
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-gray-400 text-sm">No artworks listed yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="bg-gray-50 h-48 flex items-center justify-center">
                  <p className="text-xs text-gray-300">Image via IPFS</p>
                </div>
                <div className="p-5">
                  <p className="font-medium text-sm mb-1">{product.title}</p>
                  <p className="text-xs text-gray-400 mb-4">{product.artist}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{product.price} ETH</p>
                    <button
                      onClick={() => handleBuy(product)}
                      disabled={!walletAddress || buyingId === product.id}
                      className="bg-gray-900 text-white text-xs px-4 py-2 rounded-full hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed">
                      {buyingId === product.id ? 'Confirming...' : 'Buy'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
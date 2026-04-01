import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import Link from 'next/link';

export default function Marketplace() {
  // Pulling the new getProducts and existing wallet/buy functions from Context
  const { walletAddress, buyProduct, getArtistBalance, getProducts, contract } = useWeb3();

  const [products, setProducts] = useState([]); // Start with empty array
  const [artistBalance, setArtistBalance] = useState('0');
  const [buyingId, setBuyingId] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("DEBUG: Marketplace context values:", { 
    hasWallet: !!walletAddress, 
    hasContract: !!contract, 
    hasGetProducts: !!getProducts 
  });

  // 1. Fetch Real Products from Blockchain
  useEffect(() => {
    const loadData = async () => {
      // 1. Safety Check: Don't fetch if the contract isn't ready yet
      if (!contract) return;

      try {
        setLoading(true);
        console.log("Fetching products from blockchain...");
        
        const data = await getProducts();
        
        setProducts(data);
      } catch (err) {
        console.error("Failed to load marketplace:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [contract, getProducts]); // <-- CRITICAL: This tells React to run when the wallet connects

  // 2. Load Artist Balance
  useEffect(() => {
    if (walletAddress && getArtistBalance) {
      getArtistBalance(walletAddress).then(setArtistBalance);
    }
  }, [walletAddress, getArtistBalance, products]); // Update balance when wallet connects or products change

  const handleBuy = async (product) => {
    if (!walletAddress) return alert("Please connect your wallet first");
    
    try {
      setBuyingId(product.id);
      await buyProduct(product.id, product.price);
      // Refresh products after a successful purchase
      const updatedData = await getProducts();
      setProducts(updatedData);
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setBuyingId(null);
    }
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
        
        {/* Artist Dashboard Section */}
        {walletAddress && (
          <div className="border border-gray-100 rounded-2xl p-8 mb-16 bg-gray-50/50">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Artist Dashboard</p>
            <p className="text-3xl font-semibold tracking-tight mb-1">{artistBalance} ETH</p>
            <p className="text-sm text-gray-400">Your earnings stored in the SplitStream contract</p>
          </div>
        )}

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Available artworks</h1>
          <Link href="/upload" className="text-sm border border-gray-200 px-4 py-2 rounded-full hover:border-gray-400 transition-colors">
            + Upload yours
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-400 text-sm">Querying the blockchain...</p>
          </div>
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No artworks have been minted to the Sepolia network yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => (
              <div key={product.id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Image Section using Pinata Gateway */}
                <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-50">
                  {product.cid ? (
                    <img 
                      src={`https://gateway.pinata.cloud/ipfs/${product.cid}`} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <p className="text-xs text-gray-300">No image data found</p>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-sm truncate pr-2">{product.title}</p>
                    {product.isSold && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase font-bold">Sold</span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-gray-400 mb-4 truncate italic">By: {product.owner}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Price</p>
                      <p className="text-sm font-bold">{product.price} ETH</p>
                    </div>
                    
                    <button
                      onClick={() => handleBuy(product)}
                      disabled={!walletAddress || buyingId === product.id || product.isSold}
                      className="bg-gray-900 text-white text-xs px-6 py-2.5 rounded-full hover:bg-black disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-md active:scale-95">
                      {buyingId === product.id ? 'Processing...' : product.isSold ? 'Collected' : 'Buy Now'}
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
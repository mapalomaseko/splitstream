import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Marketplace() {
  const {
    walletAddress,
    buyProduct,
    getProducts,
    getBuyerPurchases,
    contract,
    salesActivity,
  } = useWeb3();

  const [products, setProducts] = useState([]);
  const [collection, setCollection] = useState([]);
  const [buyingId, setBuyingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collectionLoading, setCollectionLoading] = useState(false);
  const [viewMode, setViewMode] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      if (!contract) return;

      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load marketplace:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [contract, getProducts, salesActivity]);

  useEffect(() => {
    const loadCollection = async () => {
      if (!walletAddress || !contract || viewMode !== 'collection') {
        setCollection([]);
        return;
      }

      try {
        setCollectionLoading(true);
        const purchased = await getBuyerPurchases(walletAddress);
        setCollection(purchased);
      } catch (error) {
        console.error('Failed to load buyer history:', error);
        setCollection([]);
      } finally {
        setCollectionLoading(false);
      }
    };

    loadCollection();
  }, [walletAddress, contract, viewMode, getBuyerPurchases, salesActivity]);

  const handleBuy = async (product) => {
    if (!walletAddress) return alert("Please connect your wallet first");
    
    try {
      setBuyingId(product.id);
      await buyProduct(product.id, product.price);
      const [updatedProducts, updatedCollection] = await Promise.all([
        getProducts(),
        getBuyerPurchases(walletAddress),
      ]);
      setProducts(updatedProducts);
      setCollection(updatedCollection);
    } catch (error) {
      console.error("Purchase failed:", error);
    } finally {
      setBuyingId(null);
    }
  };

  const displayedProducts = viewMode === 'collection' ? collection : products;

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Available artworks</h1>
          <div className="flex items-center gap-3">
            {walletAddress && (
              <div className="rounded-full border border-gray-200 p-1 flex">
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-4 py-1.5 rounded-full text-xs transition-colors ${
                    viewMode === 'all' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Marketplace
                </button>
                <button
                  onClick={() => setViewMode('collection')}
                  className={`px-4 py-1.5 rounded-full text-xs transition-colors ${
                    viewMode === 'collection' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  My Collection
                </button>
              </div>
            )}

            <Link href="/upload" className="text-sm border border-gray-200 px-4 py-2 rounded-full hover:border-gray-400 transition-colors">
              + Upload yours
            </Link>
          </div>
        </div>

        {loading || (viewMode === 'collection' && collectionLoading) ? (
          <div className="flex flex-col items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-400 text-sm">Querying the blockchain...</p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <p className="text-gray-400 text-sm italic">
            {viewMode === 'collection'
              ? 'No purchases found for this wallet yet.'
              : 'No artworks have been minted to the Sepolia network yet.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProducts.map(product => (
              <div key={product.id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
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
                    {viewMode === 'collection' && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase font-bold">Owned</span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-gray-400 mb-4 truncate italic">By: {product.owner}</p>

                  {viewMode === 'collection' && product.txHash && (
                    <a
                      href={`https://sepolia.etherscan.io/tx/${product.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-gray-500 underline mb-4 inline-block"
                    >
                      View Receipt
                    </a>
                  )}
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Price</p>
                      <p className="text-sm font-bold">
                        {viewMode === 'collection' ? product.purchasedPrice : product.price} ETH
                      </p>
                    </div>
                    
                    {viewMode === 'all' && (
                      <button
                        onClick={() => handleBuy(product)}
                        disabled={!walletAddress || buyingId === product.id}
                        className="bg-gray-900 text-white text-xs px-6 py-2.5 rounded-full hover:bg-black disabled:opacity-20 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                      >
                        {buyingId === product.id ? 'Processing...' : 'Buy Now'}
                      </button>
                    )}
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
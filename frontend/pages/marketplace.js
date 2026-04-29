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
    <main className="min-h-screen bg-brand-mist text-brand-ink">
      <Navbar />

      <section className="shell py-12 md:py-16">
        <div className="section-card p-6 md:p-8 mb-8 bg-white relative overflow-hidden">
          <div className="absolute -top-16 -right-12 h-44 w-44 rounded-full glow-orb opacity-80" />
          <p className="label-kicker mb-2">Marketplace</p>
          <h1 className="display-title text-4xl md:text-5xl text-brand-navy mb-3">Collect on-chain artwork</h1>
          <p className="text-slate-600 max-w-2xl leading-relaxed">
            Browse verified pieces, purchase directly with your wallet, and track every receipt on Sepolia.
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="font-display text-2xl tracking-tight text-brand-navy">Available artworks</h2>
          <div className="flex flex-wrap items-center gap-3">
            {walletAddress && (
              <div className="rounded-xl border border-brand-line p-1 flex bg-white shadow-soft">
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'all' ? 'bg-brand-sky text-white shadow-soft' : 'text-slate-600 hover:text-brand-navy'
                    }`}
                >
                  Marketplace
                </button>
                <button
                  onClick={() => setViewMode('collection')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'collection' ? 'bg-brand-sky text-white shadow-soft' : 'text-slate-600 hover:text-brand-navy'
                    }`}
                >
                  My Collection
                </button>
              </div>
            )}

            <Link href="/upload" className="btn-secondary">
              + Upload yours
            </Link>
          </div>
        </div>

        {loading || (viewMode === 'collection' && collectionLoading) ? (
          <div className="section-card flex flex-col items-center py-20 bg-white">
            <div className="animate-spin rounded-full h-9 w-9 border-2 border-brand-line border-t-brand-sky mb-4"></div>
            <p className="text-slate-500 text-sm">Querying the blockchain...</p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <p className="section-card p-8 text-slate-500 text-sm italic bg-white">
            {viewMode === 'collection'
              ? 'No purchases found for this wallet yet.'
              : 'No artworks have been minted to the Sepolia network yet.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProducts.map(product => (
              <article key={product.id} className="group section-card overflow-hidden hover:-translate-y-1 transition-all duration-300 bg-white animate-fade-up">
                <div className="aspect-square bg-brand-skySoft/60 flex items-center justify-center overflow-hidden border-b border-brand-line">
                  {product.cid ? (
                    <img
                      src={`https://gateway.pinata.cloud/ipfs/${product.cid}`}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <p className="text-xs text-slate-400">No image data found</p>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-sm truncate pr-2 text-brand-navy">{product.title}</p>
                    {viewMode === 'collection' && (
                      <span className="text-[10px] bg-brand-skySoft text-brand-navy px-2 py-0.5 rounded-full uppercase font-bold">Owned</span>
                    )}
                  </div>

                  {viewMode === 'collection' && product.txHash && (
                    <a
                      href={`https://sepolia.etherscan.io/tx/${product.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-brand-navy underline mb-4 inline-block"
                    >
                      View Receipt
                    </a>
                  )}

                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Price</p>
                      <p className="text-sm font-bold text-brand-navy">
                        {viewMode === 'collection' ? product.purchasedPrice : product.price} ETH
                      </p>
                    </div>

                    {viewMode === 'all' && (
                      <button
                        onClick={() => handleBuy(product)}
                        disabled={!walletAddress || buyingId === product.id}
                        className="bg-brand-sky text-white text-xs font-bold px-6 py-2.5 rounded-xl hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                      >
                        {buyingId === product.id ? 'Processing...' : 'Buy Now'}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
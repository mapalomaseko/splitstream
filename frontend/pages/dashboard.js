import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useWeb3 } from '../context/Web3Context';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const {
    walletAddress,
    isArtist,
    contract,
    salesActivity,
    getArtistDashboardStats,
  } = useWeb3();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    worksUploaded: 0,
    totalSales: 0,
    revenueReceived: '0',
    artistProducts: [],
  });

  useEffect(() => {
    if (walletAddress && !isArtist) {
      router.replace('/marketplace');
    }
  }, [walletAddress, isArtist, router]);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!walletAddress || !isArtist || !contract) {
        setLoading(false);
        setStats({
          worksUploaded: 0,
          totalSales: 0,
          revenueReceived: '0',
          artistProducts: [],
        });
        return;
      }

      try {
        setLoading(true);
        const data = await getArtistDashboardStats(walletAddress);
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [walletAddress, isArtist, contract, getArtistDashboardStats, salesActivity]);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-16">
        {!walletAddress ? (
          <div className="border border-gray-100 rounded-2xl p-8 bg-gray-50">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Artist Dashboard</p>
            <h1 className="text-2xl font-semibold tracking-tight mb-2">Connect your wallet</h1>
            <p className="text-sm text-gray-500">
              Dashboard access is available for the registered team artist wallets.
            </p>
          </div>
        ) : !isArtist ? (
          <div className="border border-gray-100 rounded-2xl p-8 bg-gray-50">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Artist Dashboard</p>
            <h1 className="text-2xl font-semibold tracking-tight mb-2">Redirecting to marketplace...</h1>
            <p className="text-sm text-gray-500 mb-4">
              This wallet is not one of the configured SplitStream artist addresses.
            </p>
            <Link href="/marketplace" className="text-sm underline text-gray-700">Go now</Link>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
            <p className="text-gray-400 text-sm">Loading artist dashboard...</p>
          </div>
        ) : (
          <>
            <div className="border border-gray-100 rounded-2xl p-8 mb-10 bg-gray-50/50">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Vault</p>
              <p className="text-3xl font-semibold tracking-tight mb-1">{stats.revenueReceived} ETH</p>
              <p className="text-sm text-gray-500">Total received from contract splits</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="border border-gray-100 rounded-2xl p-6">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Total Sales</p>
                <p className="text-3xl font-semibold tracking-tight">{stats.totalSales}</p>
              </div>
              <div className="border border-gray-100 rounded-2xl p-6">
                <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">Works Uploaded</p>
                <p className="text-3xl font-semibold tracking-tight">{stats.worksUploaded}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold tracking-tight mb-4">Your uploaded works</h2>
              {stats.artistProducts.length === 0 ? (
                <p className="text-gray-400 text-sm italic">No works uploaded from this wallet yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stats.artistProducts.map((product) => (
                    <div key={product.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                      <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-50">
                        {product.cid ? (
                          <img
                            src={`https://gateway.pinata.cloud/ipfs/${product.cid}`}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <p className="text-xs text-gray-300">No image data found</p>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="font-medium text-sm truncate">{product.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{product.price} ETH</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

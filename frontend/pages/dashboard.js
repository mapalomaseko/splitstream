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
    <main className="min-h-screen bg-brand-mist text-brand-ink">
      <Navbar />

      <section className="shell py-12 md:py-16">
        {!walletAddress ? (
          <div className="section-card p-8 bg-white">
            <p className="label-kicker mb-3">Artist Dashboard</p>
            <h1 className="font-display text-3xl tracking-tight mb-2 text-brand-navy">Connect your wallet</h1>
            <p className="text-sm text-slate-600">
              Dashboard access is available for the registered team artist wallets.
            </p>
          </div>
        ) : !isArtist ? (
          <div className="section-card p-8 bg-white">
            <p className="label-kicker mb-3">Artist Dashboard</p>
            <h1 className="font-display text-3xl tracking-tight mb-2 text-brand-navy">Redirecting to marketplace...</h1>
            <p className="text-sm text-slate-600 mb-4">
              This wallet is not one of the configured SplitStream artist addresses.
            </p>
            <Link href="/marketplace" className="text-sm underline text-brand-navy">Go now</Link>
          </div>
        ) : loading ? (
          <div className="section-card flex flex-col items-center py-20 bg-white">
            <div className="animate-spin rounded-full h-9 w-9 border-2 border-brand-line border-t-brand-sky mb-4"></div>
            <p className="text-slate-500 text-sm">Loading artist dashboard...</p>
          </div>
        ) : (
          <>
            <div className="rounded-2xl p-8 md:p-10 mb-8 bg-brand-navy text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 h-40 w-40 glow-orb opacity-70 animate-float-slow" />
              <p className="label-kicker mb-2">Vault</p>
              <p className="font-display text-4xl md:text-5xl tracking-tight mb-1">{stats.revenueReceived} ETH</p>
              <p className="text-sm text-slate-300">Total received from contract splits</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="section-card p-6 bg-white animate-fade-up">
                <p className="label-kicker mb-2">Total Sales</p>
                <p className="font-display text-4xl tracking-tight text-brand-navy">{stats.totalSales}</p>
              </div>
              <div className="section-card p-6 bg-white animate-fade-up [animation-delay:120ms]">
                <p className="label-kicker mb-2">Works Uploaded</p>
                <p className="font-display text-4xl tracking-tight text-brand-navy">{stats.worksUploaded}</p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl tracking-tight mb-4 text-brand-navy">Your uploaded works</h2>
              {stats.artistProducts.length === 0 ? (
                <p className="section-card p-6 text-slate-500 text-sm italic bg-white">No works uploaded from this wallet yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stats.artistProducts.map((product) => (
                    <article key={product.id} className="section-card overflow-hidden bg-white hover:-translate-y-1 transition-all duration-300">
                      <div className="aspect-square bg-brand-skySoft/60 flex items-center justify-center overflow-hidden border-b border-brand-line">
                        {product.cid ? (
                          <img
                            src={`https://gateway.pinata.cloud/ipfs/${product.cid}`}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        ) : (
                          <p className="text-xs text-slate-400">No image data found</p>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="font-semibold text-sm truncate text-brand-navy">{product.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{product.price} ETH</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

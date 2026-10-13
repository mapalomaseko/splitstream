import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import Navbar from '../components/Navbar';

export default function Upload() {
  const { walletAddress, connectWallet, registerProduct } = useWeb3();

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);

  // UI Status State
  const [status, setStatus] = useState('idle'); // idle, uploading, confirming, success, error
  const [txHash, setTxHash] = useState('');

  const handleUpload = async () => {
    if (!file || !title || !price) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setStatus('uploading');

      // STEP 1: Pin the file to IPFS via our API route (keeps the Pinata key server-side)
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const pinataData = await res.json();
      if (!pinataData.IpfsHash) throw new Error(pinataData.error || "IPFS Upload Failed");

      const cid = pinataData.IpfsHash;

      // STEP 2: Register the CID on-chain
      setStatus('confirming');

      // registerProduct handles the ETH -> wei conversion
      const hash = await registerProduct(cid, price);
      setTxHash(hash);

      setStatus('success');
    } catch (error) {
      console.error("Upload/Registration Error:", error);
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-brand-mist text-brand-ink">
      <Navbar />

      <section className="shell py-12 md:py-16">
        <div className="max-w-3xl mx-auto section-card bg-white overflow-hidden">
          <div className="bg-brand-navy text-white p-8 md:p-10 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full glow-orb animate-float-slow" />
            <p className="label-kicker mb-2">Creator Studio</p>
            <h1 className="display-title text-4xl md:text-5xl mb-3">Upload your artwork</h1>
            <p className="text-slate-300 text-sm md:text-base max-w-xl">
              Your file is pinned to IPFS and the listing is registered on-chain in one flow.
            </p>
          </div>

          <div className="p-7 md:p-10">

            {!walletAddress ? (
              <div className="border border-brand-line rounded-xl p-6 mb-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-brand-skySoft">
                <p className="text-sm text-slate-600">Connect your wallet to publish artwork.</p>
                <button
                  onClick={connectWallet}
                  className="btn-primary"
                >
                  Connect Wallet
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-widest mb-2 block font-bold">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Sunset #001"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full border border-brand-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-sky transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-widest mb-2 block font-bold">Price (ETH)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.05"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full border border-brand-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-sky transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-widest mb-2 block font-bold">Artwork File</label>
                  <div className="border border-dashed border-brand-line rounded-xl px-4 py-10 text-center bg-brand-skySoft/60 hover:bg-brand-skySoft transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setFile(e.target.files[0])}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                      {file ? (
                        <span className="text-sm text-brand-navy font-semibold">{file.name}</span>
                      ) : (
                        <span className="text-sm text-slate-600">Click to select an image from your device</span>
                      )}
                    </label>
                  </div>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={status === 'uploading' || status === 'confirming' || !title || !price || !file}
                  className="w-full bg-brand-sky text-white text-sm py-4 rounded-xl hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-40 disabled:cursor-not-allowed mt-2 font-bold transition-all"
                >
                  {status === 'idle' ? 'Upload & Register' : 'Processing...'}
                </button>

                <div className="mt-4 space-y-2">
                  {status === 'uploading' && <p className="text-sm text-brand-sky animate-pulse">Uploading to IPFS via Pinata...</p>}
                  {status === 'confirming' && <p className="text-sm text-brand-navy animate-pulse">Awaiting blockchain confirmation...</p>}
                  {status === 'success' && (
                    <div className="bg-brand-skySoft p-4 rounded-xl border border-brand-line animate-fade-up">
                      <p className="text-sm text-brand-navy font-semibold">Successfully registered on-chain.</p>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${txHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-brand-navy underline mt-1 inline-block"
                      >
                        View on Etherscan
                      </a>
                    </div>
                  )}
                  {status === 'error' && <p className="text-sm text-rose-500">Transaction failed. Check MetaMask and try again.</p>}
                </div>

              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { toWei } from '../utils/contractHelpers';
import Link from 'next/link';

export default function Upload() {
  const { walletAddress, connectWallet, registerProduct } = useWeb3();

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  
  // UI Status State 
  const [status, setStatus] = useState('idle'); // idle, uploading, confirming, success, error
  const [txHash, setTxHash] = useState('');

  /**
   * THE INTEGRATION FLOW (Week 2) 
   * 1. Upload file to Pinata (IPFS) -> Get CID
   * 2. Call Smart Contract registerProduct(cid, price)
   */
  const handleUpload = async () => {
    if (!file || !title || !price) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setStatus('uploading');

      // STEP 1: Upload to Pinata 
      // In a real setup, S4S would provide the 'uploadToPinata' utility
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
        },
        body: formData,
      });
      
      const pinataData = await res.json();
      if (!pinataData.IpfsHash) throw new Error("IPFS Upload Failed");
      
      const cid = pinataData.IpfsHash;
      console.log("IPFS CID:", cid);

      // STEP 2: Register on Blockchain 
      setStatus('confirming');
      
      // Call your Web3Context function (it handles Wei conversion internally)
      const hash = await registerProduct(cid, price);
      setTxHash(hash);
      
      setStatus('success');
    } catch (error) {
      console.error("Upload/Registration Error:", error);
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Navigation [cite: 42] */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-gray-100">
        <Link href="/" className="font-semibold text-lg tracking-tight">SplitStream</Link>
        <div className="flex items-center gap-8">
          <Link href="/marketplace" className="text-sm text-gray-500 hover:text-gray-900">Marketplace</Link>
          <Link href="/upload" className="text-sm text-gray-900 font-medium">Upload</Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-20">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Upload your artwork</h1>
        <p className="text-gray-400 text-sm mb-10">
          Your file goes to IPFS. The listing is registered on-chain.
        </p>

        {/* Not connected warning [cite: 36, 49] */}
        {!walletAddress ? (
          <div className="border border-gray-100 rounded-2xl p-6 mb-8 flex items-center justify-between bg-gray-50">
            <p className="text-sm text-gray-500">Connect your wallet to upload</p>
            <button
              onClick={connectWallet}
              className="bg-gray-900 text-white text-sm px-4 py-2 rounded-full hover:bg-gray-700 transition-colors">
              Connect Wallet
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Form Fields [cite: 44] */}
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block font-bold">Title</label>
              <input
                type="text"
                placeholder="e.g. Sunset #001"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-all"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block font-bold">Price (ETH)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.05"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 transition-all"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block font-bold">Artwork File</label>
              <div className="border border-dashed border-gray-200 rounded-xl px-4 py-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setFile(e.target.files[0])}
                  className="hidden"
                  id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                  {file ? (
                    <span className="text-sm text-gray-900 font-medium">{file.name}</span>
                  ) : (
                    <span className="text-sm text-gray-400">Click to select an image from your device</span>
                  )}
                </label>
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={status === 'uploading' || status === 'confirming' || !title || !price || !file}
              className="w-full bg-gray-900 text-white text-sm py-4 rounded-full hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed mt-4 font-semibold transition-all shadow-sm">
              {status === 'idle' ? 'Upload & Register' : 'Processing...'}
            </button>

            {/* Transaction Status Feedbacks  */}
            <div className="mt-6 text-center space-y-2">
              {status === 'uploading' && <p className="text-sm text-blue-500 animate-pulse">Uploading to IPFS via Pinata...</p>}
              {status === 'confirming' && <p className="text-sm text-orange-500 animate-pulse">Awaiting Blockchain Confirmation...</p>}
              {status === 'success' && (
                <div className="bg-green-50 p-4 rounded-xl">
                  <p className="text-sm text-green-600 font-medium italic">Successfully registered on-chain!</p>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${txHash}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs text-green-700 underline mt-1 block">
                    View on Etherscan
                  </a>
                </div>
              )}
              {status === 'error' && <p className="text-sm text-red-500">Transaction failed. Check MetaMask and try again.</p>}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
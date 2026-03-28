import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import Link from 'next/link';

export default function Upload() {
  const { walletAddress, connectWallet, registerProduct } = useWeb3();

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');

  const handleUpload = async () => {
    // Week 2: this will upload to Pinata and call registerProduct()
    // For now it just logs
    console.log({ title, price, file });
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* Navigation */}
      <nav className="flex justify-between items-center px-10 py-6 border-b border-gray-100">
        <Link href="/" className="font-semibold text-lg tracking-tight">SplitStream</Link>
        <div className="flex items-center gap-8">
          <Link href="/marketplace" className="text-sm text-gray-500 hover:text-gray-900">
            Marketplace
          </Link>
          <Link href="/upload" className="text-sm text-gray-900 font-medium">
            Upload
          </Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-6 py-20">
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Upload your artwork</h1>
        <p className="text-gray-400 text-sm mb-10">
          Your file goes to IPFS. The listing is registered on-chain.
        </p>

        {/* Not connected warning */}
        {!walletAddress && (
          <div className="border border-gray-100 rounded-2xl p-6 mb-8 flex items-center justify-between">
            <p className="text-sm text-gray-500">Connect your wallet to upload</p>
            <button
              onClick={connectWallet}
              className="bg-gray-900 text-white text-sm px-4 py-2 rounded-full hover:bg-gray-700">
              Connect Wallet
            </button>
          </div>
        )}

        {/* Upload form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g. Sunset #001"
              onChange={e => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
              Price (ETH)
            </label>
            <input
              type="number"
              placeholder="e.g. 0.05"
              onChange={e => setPrice(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">
              File
            </label>
            <div className="border border-dashed border-gray-200 rounded-xl px-4 py-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={e => setFile(e.target.files[0])}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                {file ? (
                  <p className="text-sm text-gray-900">{file.name}</p>
                ) : (
                  <p className="text-sm text-gray-400">Click to select an image</p>
                )}
              </label>
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={!walletAddress || !title || !price || !file}
            className="w-full bg-gray-900 text-white text-sm py-3 rounded-full hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed mt-2">
            Upload & Register
          </button>
        </div>

        {/* Status messages */}
        {status === 'uploading' && (
          <p className="text-sm text-gray-400 mt-6 text-center">Uploading to IPFS...</p>
        )}
        {status === 'confirming' && (
          <p className="text-sm text-gray-400 mt-6 text-center">Waiting for confirmation...</p>
        )}
        {status === 'success' && (
          <p className="text-sm text-green-500 mt-6 text-center">Successfully registered on-chain!</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-400 mt-6 text-center">Something went wrong. Try again.</p>
        )}
      </div>

    </main>
  );
}
import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

export default function ProductCard({ productId, title, price, cid, artist }) {
  const { buyProduct, walletAddress } = useWeb3();

  const [status, setStatus] = useState('idle'); // idle | confirming | success | error
  const [txHash, setTxHash] = useState('');

  const handleBuy = async () => {
    // Week 2: wire this up for real
    console.log('Buying:', title);
  };

  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">

      {/* Image */}
      <div className="bg-gray-50 h-48 flex items-center justify-center">
        {cid ? (
          <img
            src={"https://gateway.pinata.cloud/ipfs/" + cid}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <p className="text-xs text-gray-300">Image via IPFS</p>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <p className="font-medium text-sm mb-1">{title || 'Untitled'}</p>
        <p className="text-xs text-gray-400 mb-4">{artist}</p>

        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{price} ETH</p>
          <button
            onClick={handleBuy}
            disabled={!walletAddress || status === 'confirming'}
            className="bg-gray-900 text-white text-xs px-4 py-2 rounded-full hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed">
            {status === 'confirming' ? 'Confirming...' : 'Buy'}
          </button>
        </div>

        {/* Status messages */}
        {status === 'success' && (
          <div className="mt-3">
            <p className="text-xs text-green-500">Purchase confirmed!</p>
            {txHash && (
              
                href={"https://sepolia.etherscan.io/tx/" + txHash}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-gray-400 hover:text-gray-900">
                View on Etherscan →
              </a>
            )}
          </div>
        )}

        {status === 'error' && (
          <p className="text-xs text-red-400 mt-3">Something went wrong. Try again.</p>
        )}
      </div>

    </div>
  );
}
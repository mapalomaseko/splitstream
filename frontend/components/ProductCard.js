import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

export default function ProductCard({ id, title, price, cid, owner, isSold }) {
  const { buyProduct, walletAddress } = useWeb3();

  const [status, setStatus] = useState('idle'); // idle | confirming | success | error
  const [txHash, setTxHash] = useState('');

  const handleBuy = async () => {
    if (!walletAddress) return alert("Please connect your wallet first");
    
    try {
      setStatus('confirming');
      
      // We pass the ID and the raw price (e.g., "0.05") 
      // The context handles the parseEther conversion
      const hash = await buyProduct(id, price);
      
      setTxHash(hash);
      setStatus('success');
    } catch (error) {
      console.error("Purchase failed:", error);
      setStatus('error');
    }
  };

  const imageUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;

  return (
    <div className={`border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 ${isSold ? 'opacity-75 shadow-none' : 'hover:shadow-lg'}`}>

      {/* Image Section */}
      <div className="bg-gray-50 h-56 flex items-center justify-center relative overflow-hidden">
        {cid ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <p className="text-xs text-gray-300 italic">No image data</p>
        )}
        
        {isSold && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-1">
          <p className="font-semibold text-sm truncate">{title || 'Untitled Artwork'}</p>
          <p className="text-xs font-bold text-gray-900">{price} ETH</p>
        </div>
        
        {/* Shorten the owner address for a cleaner look */}
        <p className="text-[10px] font-mono text-gray-400 mb-6 truncate">
          Artist: {owner}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleBuy}
            disabled={!walletAddress || status === 'confirming' || isSold}
            className="w-full bg-gray-900 text-white text-xs py-3 rounded-xl hover:bg-black disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-95">
            {status === 'confirming' ? 'Waiting for block...' : isSold ? 'Collected' : 'Purchase Piece'}
          </button>

          {/* Status Messages & Etherscan Link */}
          {status === 'success' && (
            <div className="bg-green-50 p-3 rounded-xl border border-green-100 animate-fade-in">
              <p className="text-[10px] text-green-600 font-medium">✨ Ownership transferred!</p>
              {txHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[9px] text-green-700 underline block mt-1 hover:text-green-900">
                  View transaction on Etherscan →
                </a>
              )}
            </div>
          )}

          {status === 'error' && (
            <p className="text-[10px] text-red-500 text-center font-medium">Transaction failed. Check MetaMask.</p>
          )}
        </div>
      </div>
    </div>
  );
}
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
    <div className={`section-card overflow-hidden transition-all duration-300 hover:-translate-y-1 ${isSold ? 'opacity-75 shadow-none' : 'hover:shadow-soft'}`}>

      <div className="bg-brand-skySoft/60 h-56 flex items-center justify-center relative overflow-hidden">
        {cid ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <p className="text-xs text-slate-400 italic">No image data</p>
        )}

        {isSold && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-brand-navy text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-1">
          <p className="font-semibold text-sm truncate text-brand-navy">{title || 'Untitled Artwork'}</p>
          <p className="text-xs font-bold text-brand-navy">{price} ETH</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleBuy}
            disabled={!walletAddress || status === 'confirming' || isSold}
            className="w-full bg-brand-sky text-white text-xs py-3 rounded-xl hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 font-bold">
            {status === 'confirming' ? 'Waiting for block...' : isSold ? 'Collected' : 'Purchase Piece'}
          </button>

          {status === 'success' && (
            <div className="bg-brand-skySoft p-3 rounded-xl border border-brand-line animate-fade-up">
              <p className="text-[10px] text-brand-navy font-medium">Ownership transferred.</p>
              {txHash && (
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[9px] text-brand-navy underline block mt-1 hover:text-slate-700">
                  View transaction on Etherscan →
                </a>
              )}
            </div>
          )}

          {status === 'error' && (
            <p className="text-[10px] text-rose-500 text-center font-medium">Transaction failed. Check MetaMask.</p>
          )}
        </div>
      </div>
    </div>
  );
}
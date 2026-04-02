// ============================================================
// STUDENTS 2 (logic) + 4 (styling) — CONNECT WALLET BUTTON
// ============================================================
// Used on the Landing Page and Navbar.
//
// TASKS FOR STUDENT 2:
// [ ] Import useWeb3 and pull out walletAddress and connectWallet
// [ ] Wire the button's onClick to connectWallet()
// [ ] Handle the case where MetaMask is not installed
//
// TASKS FOR STUDENT 4:
// [ ] Style with Tailwind — button should look different when connected vs disconnected
// [ ] When connected: show shortened address (use formatAddress from utils/contractHelpers.js)
// [ ] When disconnected: show "Connect Wallet" text
// ============================================================

import { useWeb3 } from '../context/Web3Context';
import { formatAddress } from '../utils/contractHelpers';

export default function ConnectWallet() {
  const { walletAddress, connectWallet, isConnecting } = useWeb3();

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-sky focus:ring-offset-2 ${
        walletAddress
          ? 'bg-brand-skySoft text-brand-navy border border-brand-line hover:bg-white'
          : 'bg-brand-sky text-white hover:-translate-y-0.5 hover:shadow-glow'
      } ${isConnecting ? 'opacity-70 cursor-wait' : ''}`}
    >
      {isConnecting ? 'Connecting...' : walletAddress ? formatAddress(walletAddress) : 'Connect Wallet'}
    </button>
  );
}

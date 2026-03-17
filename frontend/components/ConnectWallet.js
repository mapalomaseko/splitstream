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
  const { walletAddress, connectWallet } = useWeb3();

  return (
    <button
      onClick={connectWallet}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {walletAddress ? formatAddress(walletAddress) : 'Connect Wallet'}
    </button>
  );
}

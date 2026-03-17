// ============================================================
// STUDENT 4 — NAVIGATION BAR
// ============================================================
// Appears on every page. Contains links + ConnectWallet button.
//
// TASKS:
// [ ] Links to: / (Home), /marketplace, /upload
// [ ] Include ConnectWallet component on the right side
// [ ] Highlight the current active page
// [ ] Make it responsive (mobile-friendly with Tailwind)
// ============================================================

import Link from 'next/link';
import ConnectWallet from './ConnectWallet';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex gap-6">
        <Link href="/">Home</Link>
        <Link href="/marketplace">Marketplace</Link>
        <Link href="/upload">Upload</Link>
      </div>
      <ConnectWallet />
    </nav>
  );
}

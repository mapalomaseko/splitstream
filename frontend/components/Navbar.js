import Link from 'next/link';
import { useRouter } from 'next/router';
import ConnectWallet from './ConnectWallet';
import { useWeb3 } from '../context/Web3Context';

export default function Navbar() {
  const router = useRouter();
  const { isArtist } = useWeb3();

  const linkClass = (path) =>
    router.pathname === path
      ? 'text-sm text-gray-900 font-medium'
      : 'text-sm text-gray-500 hover:text-gray-900';

  return (
    <nav className="flex justify-between items-center px-10 py-6 border-b border-gray-100">
      <Link href="/" className="font-semibold text-lg tracking-tight">
        SplitStream
      </Link>
      <div className="flex items-center gap-8">
        <Link href="/marketplace" className={linkClass('/marketplace')}>
          Marketplace
        </Link>
        <Link href="/upload" className={linkClass('/upload')}>
          Upload
        </Link>
        {isArtist && (
          <Link href="/dashboard" className={linkClass('/dashboard')}>
            Dashboard
          </Link>
        )}
        <ConnectWallet />
      </div>
    </nav>
  );
}
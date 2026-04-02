import Link from 'next/link';
import { useRouter } from 'next/router';
import ConnectWallet from './ConnectWallet';
import { useWeb3 } from '../context/Web3Context';

export default function Navbar() {
  const router = useRouter();
  const { isArtist } = useWeb3();

  const linkClass = (path) =>
    router.pathname === path
      ? 'text-sm text-brand-navy font-bold bg-brand-skySoft border border-brand-line px-3 py-1.5 rounded-lg'
      : 'text-sm text-slate-600 hover:text-brand-navy px-3 py-1.5 rounded-lg transition-colors';

  return (
    <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-brand-line">
      <div className="shell py-4 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="font-display font-bold text-xl tracking-tight text-brand-navy">
          SplitStream
        </Link>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
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
      </div>
    </nav>
  );
}
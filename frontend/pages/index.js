// ============================================================
// STUDENT 4 — PAGE 1: LANDING PAGE
// ============================================================
// The first thing visitors see. Explains the platform and
// prompts them to connect their wallet.
//
// TASKS:
// [ ] Build the hero section: headline, subheading, CTA button
// [ ] Add the ConnectWallet component
// [ ] Add navigation links to /marketplace and /upload
// [ ] Style with Tailwind CSS
// [ ] Show connected wallet address if already connected
// ============================================================

import Head from 'next/head';
import Link from 'next/link';
import ConnectWallet from '../components/ConnectWallet';

export default function Home() {
  return (
    <>
      <Head>
        <title>SplitStream — Blockchain Art Platform</title>
      </Head>

      <main className="min-h-screen bg-white text-gray-900">

        {/* Navigation */}
        <nav className="flex justify-between items-center px-10 py-6 border-b border-gray-100">
          <span className="font-semibold text-lg tracking-tight">SplitStream</span>
          <div className="flex items-center gap-8">
            <Link href="/marketplace" className="text-sm text-gray-500 hover:text-gray-900">
              Marketplace
            </Link>
            <Link href="/upload" className="text-sm text-gray-500 hover:text-gray-900">
              Upload
            </Link>
            <ConnectWallet />
          </div>
        </nav>

        {/* Hero */}
        <section className="flex flex-col items-center justify-center text-center px-6 py-40">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-6">
            Powered by Ethereum
          </p>
          <h1 className="text-5xl font-semibold tracking-tight max-w-2xl leading-tight mb-6">
            Own art. Split revenue. No middleman.
          </h1>
          <p className="text-gray-400 text-lg max-w-md mb-10">
            Upload digital art, set your splits, and get paid automatically — 
            every time someone buys.
          </p>
          <div className="flex gap-4">
            <Link href="/marketplace"
              className="bg-gray-900 text-white text-sm px-6 py-3 rounded-full hover:bg-gray-700">
              Browse Marketplace
            </Link>
            <Link href="/upload"
              className="border border-gray-200 text-sm px-6 py-3 rounded-full hover:border-gray-400">
              Upload Art
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-3 gap-8 px-20 pb-32 max-w-5xl mx-auto">
          <div>
            <p className="font-medium mb-2">Instant splits</p>
            <p className="text-sm text-gray-400">
              Payments are split automatically between artists the moment a purchase happens.
            </p>
          </div>
          <div>
            <p className="font-medium mb-2">No trust required</p>
            <p className="text-sm text-gray-400">
              Rules are enforced by a smart contract — not a company, not a person.
            </p>
          </div>
          <div>
            <p className="font-medium mb-2">Fully transparent</p>
            <p className="text-sm text-gray-400">
              Every transaction is publicly visible on the Ethereum blockchain.
            </p>
          </div>
        </section>

      </main>
    </>
  );
}
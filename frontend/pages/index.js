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
import ConnectWallet from '../components/ConnectWallet';

export default function Home() {
  return (
    <>
      <Head>
        <title>Blockchain Art Platform</title>
      </Head>

      <main className="min-h-screen bg-gray-900 text-white">

        {/* TODO: Build navigation bar */}

        {/* TODO: Build hero section */}
        <section>
          <h1>Own Art. Split Revenue. No Middleman.</h1>
          <p>TODO: Add subheading explaining the platform</p>
          <ConnectWallet />
        </section>

        {/* TODO: Add feature highlights section */}

        {/* TODO: Add links to marketplace and upload */}

      </main>
    </>
  );
}

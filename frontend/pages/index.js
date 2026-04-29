import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <>
      <Head>
        <title>SplitStream — Blockchain Art Platform</title>
      </Head>

      <main className="min-h-screen bg-brand-mist text-brand-ink">

        <Navbar />

        <section className="relative overflow-hidden bg-brand-navy text-white">
          <div className="absolute inset-0 bg-grid-soft opacity-25" />
          <div className="absolute -top-32 -right-12 h-80 w-80 rounded-full glow-orb animate-float-slow" />
          <div className="absolute -bottom-20 left-10 h-64 w-64 rounded-full glow-orb animate-float-slow [animation-delay:1.5s]" />

          <div className="shell relative py-24 md:py-32 text-center animate-fade-up">
            <p className="label-kicker mb-6">Built for Web3 Artists</p>
            <h1 className="display-title text-5xl md:text-7xl max-w-4xl mx-auto mb-6">
              Own the gallery.<br></br>
              <span className="text-brand-sky"> Automate every split.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-slate-300 text-base md:text-lg leading-relaxed mb-10">
              SplitStream turns on-chain commerce into a clean creative workflow: publish your work,
              let collectors buy with confidence, and keep every payout transparent.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/marketplace" className="btn-primary min-w-[190px]">
                Browse Marketplace
              </Link>
              <Link href="/upload" className="btn-secondary min-w-[190px] bg-white/95">
                Upload Artwork
              </Link>
            </div>
          </div>
        </section>

        <section className="shell py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="section-card p-7 animate-fade-up">
              <p className="font-display text-xl text-brand-navy mb-3">Instant split logic</p>
              <p className="text-slate-600 leading-relaxed">
                Every purchase routes through smart-contract rules so collaborators are paid immediately.
              </p>
            </div>
            <div className="section-card p-7 animate-fade-up [animation-delay:120ms]">
              <p className="font-display text-xl text-brand-navy mb-3">Collector trust</p>
              <p className="text-slate-600 leading-relaxed">
                Receipts, balances, and history stay visible on-chain, giving buyers and artists the same source of truth.
              </p>
            </div>
            <div className="section-card p-7 animate-fade-up [animation-delay:240ms]">
              <p className="font-display text-xl text-brand-navy mb-3">Gallery-grade clarity</p>
              <p className="text-slate-600 leading-relaxed">
                A focused interface for publishing, collecting, and managing artwork without noisy marketplace clutter.
              </p>
            </div>
          </div>

          <div className="mt-10 section-card bg-brand-navy text-white border-brand-navy p-8 md:p-10 text-center animate-fade-up">
            <p className="label-kicker text-brand-sky mb-2">Ready to mint your next release?</p>
            <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-3">Launch in minutes, not weeks.</h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-6">
              Upload a file, set price, and publish straight to the chain.
            </p>
            <Link href="/upload" className="btn-primary">
              Start Uploading
            </Link>
          </div>
        </section>

      </main>
    </>
  );
}
import Link from "next/link";
import ChainBadge from "./components/ChainBadge";

export default function Home() {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-black to-cyan-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/20 via-black to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="mb-8 inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-zinc-300">Live on Ethereum • Multichain expansion coming</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
            <span className="gradient-text">ONETIME</span>
          </h1>
          
          <p className="text-2xl md:text-3xl text-zinc-300 mb-4 font-light">
            One launch. Every chain.
          </p>
          
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
            Launch your token once, deploy everywhere. No copycats, no split liquidity. 
            Same name, same symbol, across all chains.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link 
              href="/launch"
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-violet-500/50 transition-all hover:scale-105"
            >
              Launch on Ethereum
            </Link>
            <Link 
              href="/docs"
              className="px-8 py-4 bg-white/5 border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
            >
              Learn More
            </Link>
          </div>
          
          {/* Chain Nodes Visualization */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-4xl mx-auto">
            <ChainNode chain="ethereum" live />
            <ChainNode chain="base" />
            <ChainNode chain="robinhood" />
            <ChainNode chain="bsc" />
            <ChainNode chain="solana" />
          </div>
        </div>
      </section>
      
      {/* Problem/Solution Section */}
      <section className="py-24 bg-gradient-to-b from-black to-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium">
                The Problem
              </div>
              <h2 className="text-4xl font-bold">Fragmented launches hurt everyone</h2>
              <ul className="space-y-4 text-zinc-400">
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Copycats deploy your token name on other chains</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Liquidity gets split across multiple deployments</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Community confusion about which token is real</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-red-400 mt-1">✗</span>
                  <span>Manual bridging is slow and expensive</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm font-medium">
                The Solution
              </div>
              <h2 className="text-4xl font-bold">One launch, everywhere</h2>
              <ul className="space-y-4 text-zinc-400">
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Reserve your token name across all chains at launch</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Unified liquidity pool powered by Uniswap v4 hooks</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Seamless cross-chain transfers in one transaction</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>Launch on Ethereum first, expand to all chains on your schedule</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-24 bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How it works</h2>
            <p className="text-xl text-zinc-400">Three steps to multichain dominance</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Step 
              number="01"
              title="Launch on Ethereum"
              description="Create your token with a single transaction. We reserve your name and symbol across all supported chains."
            />
            <Step 
              number="02"
              title="Build your community"
              description="Focus on growth on Ethereum while we prepare your multichain infrastructure in the background."
            />
            <Step 
              number="03"
              title="Expand everywhere"
              description="When you're ready, enable your token on Base, Robinhood, BSC, and Solana with one click."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 to-cyan-900/20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">Ready to launch?</h2>
          <p className="text-xl text-zinc-300 mb-8">
            Join the first wave of tokens launching on ONETIME
          </p>
          <Link 
            href="/launch"
            className="inline-block px-10 py-5 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl font-bold text-xl hover:shadow-2xl hover:shadow-violet-500/50 transition-all hover:scale-105"
          >
            Launch Your Token
          </Link>
        </div>
      </section>
    </div>
  );
}

function ChainNode({ chain, live = false }: { chain: "ethereum" | "base" | "robinhood" | "bsc" | "solana"; live?: boolean }) {
  return (
    <div className={`flex flex-col items-center space-y-3 p-6 rounded-2xl border-2 transition-all ${
      live 
        ? "border-violet-500 bg-violet-500/10 glow-effect" 
        : "border-white/10 bg-white/5 opacity-50 grayscale"
    }`}>
      <ChainBadge chain={chain} live={live} size="lg" showLabel={false} />
      <div className="text-center">
        <div className="font-medium text-sm">{chain.charAt(0).toUpperCase() + chain.slice(1)}</div>
        {live ? (
          <div className="text-xs text-green-400 font-medium">● Live</div>
        ) : (
          <div className="text-xs text-zinc-500">Coming Soon</div>
        )}
      </div>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 transition-all group">
      <div className="text-5xl font-bold text-violet-500/20 mb-4 group-hover:text-violet-500/40 transition-colors">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
}

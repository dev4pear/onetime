"use client";

import { useState } from "react";
import ChainBadge from "../components/ChainBadge";

const mockTokens = [
  {
    id: 1,
    name: "Cosmic Cat",
    symbol: "COSM",
    description: "The first cat in space. Literally.",
    chain: "ethereum" as const,
    live: true,
    marketCap: "$1.2M",
    holders: "2,341",
    image: "🐱",
  },
  {
    id: 2,
    name: "Moon Beans",
    symbol: "BEANS",
    description: "Coffee-powered DeFi for the nocturnal trader.",
    chain: "ethereum" as const,
    live: true,
    marketCap: "$890K",
    holders: "1,892",
    image: "☕",
  },
  {
    id: 3,
    name: "Diamond Hands",
    symbol: "DIAM",
    description: "For those who never sell. Ever.",
    chain: "ethereum" as const,
    live: true,
    marketCap: "$2.1M",
    holders: "3,567",
    image: "💎",
  },
  {
    id: 4,
    name: "Rocket Fuel",
    symbol: "FUEL",
    description: "To the moon and beyond.",
    chain: "ethereum" as const,
    live: true,
    marketCap: "$567K",
    holders: "1,234",
    image: "🚀",
  },
  {
    id: 5,
    name: "Pixel Art",
    symbol: "PXLS",
    description: "NFT-native token for the pixelated generation.",
    chain: "ethereum" as const,
    live: true,
    marketCap: "$3.4M",
    holders: "4,821",
    image: "🎨",
  },
  {
    id: 6,
    name: "Degen Mode",
    symbol: "DEGEN",
    description: "No thoughts, just vibes.",
    chain: "ethereum" as const,
    live: true,
    marketCap: "$1.8M",
    holders: "2,910",
    image: "🎲",
  },
];

type Chain = "all" | "ethereum" | "base" | "robinhood" | "bsc" | "solana";

export default function ExplorePage() {
  const [selectedChain, setSelectedChain] = useState<Chain>("all");
  
  const filteredTokens = selectedChain === "all" 
    ? mockTokens 
    : mockTokens.filter(token => token.chain === selectedChain);
  
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Explore Tokens</h1>
          <p className="text-xl text-zinc-400">
            Discover tokens launched on ONETIME
          </p>
        </div>
        
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-3 mb-12">
          <FilterChip 
            active={selectedChain === "all"} 
            onClick={() => setSelectedChain("all")}
          >
            All Chains
          </FilterChip>
          <FilterChip 
            active={selectedChain === "ethereum"} 
            onClick={() => setSelectedChain("ethereum")}
          >
            <span className="flex items-center space-x-2">
              <span>Ethereum</span>
              <span className="text-xs text-green-400">● Live</span>
            </span>
          </FilterChip>
          <FilterChip 
            disabled
          >
            <span className="flex items-center space-x-2">
              <span>Base</span>
              <span className="text-xs text-zinc-500">Coming Soon</span>
            </span>
          </FilterChip>
          <FilterChip 
            disabled
          >
            <span className="flex items-center space-x-2">
              <span>Robinhood</span>
              <span className="text-xs text-zinc-500">Coming Soon</span>
            </span>
          </FilterChip>
          <FilterChip 
            disabled
          >
            <span className="flex items-center space-x-2">
              <span>BSC</span>
              <span className="text-xs text-zinc-500">Coming Soon</span>
            </span>
          </FilterChip>
          <FilterChip 
            disabled
          >
            <span className="flex items-center space-x-2">
              <span>Solana</span>
              <span className="text-xs text-zinc-500">Coming Soon</span>
            </span>
          </FilterChip>
        </div>
        
        {/* Token Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTokens.map((token) => (
            <TokenCard key={token.id} token={token} />
          ))}
        </div>
        
        {filteredTokens.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-20">🔍</div>
            <p className="text-xl text-zinc-400">No tokens found on this chain yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({ 
  children, 
  active = false, 
  disabled = false,
  onClick 
}: { 
  children: React.ReactNode; 
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
        disabled
          ? "bg-white/5 text-zinc-500 cursor-not-allowed border border-white/5"
          : active
            ? "bg-violet-500 text-white border-2 border-violet-500"
            : "bg-white/5 text-zinc-300 border border-white/10 hover:border-violet-500/50"
      }`}
    >
      {children}
    </button>
  );
}

function TokenCard({ token }: { token: typeof mockTokens[0] }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-violet-500/50 transition-all group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-3xl">
            {token.image}
          </div>
          <div>
            <h3 className="font-bold text-lg">{token.name}</h3>
            <p className="text-sm text-zinc-400">${token.symbol}</p>
          </div>
        </div>
        
        {token.live && (
          <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-xs text-green-400 font-medium">
            Live
          </span>
        )}
      </div>
      
      <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
        {token.description}
      </p>
      
      <div className="flex items-center justify-between text-sm mb-4">
        <div>
          <div className="text-zinc-500 text-xs mb-1">Market Cap</div>
          <div className="font-semibold">{token.marketCap}</div>
        </div>
        <div>
          <div className="text-zinc-500 text-xs mb-1">Holders</div>
          <div className="font-semibold">{token.holders}</div>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 pt-4 border-t border-white/10">
        <ChainBadge chain={token.chain} live={token.live} size="sm" showLabel={false} />
        <span className="text-xs text-zinc-500">Ethereum</span>
      </div>
    </div>
  );
}

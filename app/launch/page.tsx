"use client";

import { useState } from "react";
import { ChainSelector } from "../components/ChainBadge";

type Chain = "ethereum" | "base" | "robinhood" | "bsc" | "solana";

export default function LaunchPage() {
  const [selectedChain, setSelectedChain] = useState<Chain>("ethereum");
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    website: "",
    twitter: "",
    telegram: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLaunching, setIsLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLaunching(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLaunching(false);
    setLaunched(true);
    
    setTimeout(() => {
      setLaunched(false);
      setFormData({ name: "", symbol: "", description: "", website: "", twitter: "", telegram: "" });
      setImagePreview(null);
    }, 5000);
  };
  
  const estimatedFee = "0.05 ETH";
  const isFormValid = formData.name && formData.symbol && formData.description;
  
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">Launch Your Token</h1>
          <p className="text-xl text-zinc-400">
            Create your token on Ethereum. Multichain expansion coming soon.
          </p>
        </div>
        
        {launched ? (
          <div className="bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border-2 border-violet-500 rounded-2xl p-12 text-center glow-effect">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Token Launched Successfully!</h2>
            <p className="text-zinc-300 mb-6">
              Your token <span className="font-bold text-white">{formData.symbol}</span> is now live on Ethereum.
            </p>
            <div className="space-y-2 text-sm text-zinc-400">
              <p>Contract: 0x742d...8f2e</p>
              <p>Uniswap Pool: Active</p>
              <p>Reserved on: Ethereum, Base, Robinhood, BSC, Solana</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLaunch} className="space-y-8">
            {/* Token Details */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Token Details</h2>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Token Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="My Awesome Token"
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Symbol *</label>
                    <input
                      type="text"
                      value={formData.symbol}
                      onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                      placeholder="MAT"
                      maxLength={6}
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="A brief description of your token and its purpose..."
                    rows={4}
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all resize-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Token Image (Optional)</label>
                  <div className="flex items-center space-x-4">
                    {imagePreview && (
                      <div className="w-20 h-20 rounded-xl border-2 border-white/20 overflow-hidden">
                        <img src={imagePreview} alt="Token preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label className="flex-1 cursor-pointer">
                      <div className="px-4 py-3 bg-black border border-white/20 rounded-lg hover:border-violet-500 transition-all text-center">
                        <span className="text-zinc-400">Choose file or drop here</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Social Links (Optional)</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://mytoken.com"
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">𝕏 (Twitter)</label>
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    placeholder="@mytoken"
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Telegram</label>
                  <input
                    type="text"
                    value={formData.telegram}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                    placeholder="@mytoken"
                    className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                  />
                </div>
              </div>
            </div>
            
            {/* Chain Selection */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-2">Select Chain</h2>
              <p className="text-zinc-400 mb-6">Currently available on Ethereum. More chains coming soon.</p>
              
              <ChainSelector selected={selectedChain} onChange={setSelectedChain} />
            </div>
            
            {/* Fee Estimate & Launch */}
            <div className="bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border-2 border-violet-500/30 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-zinc-400 mb-1">Estimated Fee</div>
                  <div className="text-3xl font-bold">{estimatedFee}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-zinc-400 mb-1">Plus Gas</div>
                  <div className="text-lg text-zinc-300">~$5-15</div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!isFormValid || isLaunching}
                className="w-full px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-violet-500/50 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLaunching ? "Launching..." : "Review & Launch Token"}
              </button>
              
              <p className="text-xs text-zinc-500 mt-4 text-center">
                By launching, you agree to reserve this token name across all supported chains
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

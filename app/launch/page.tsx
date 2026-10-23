"use client";

import { useState } from "react";
import { ChainSelector } from "../components/ChainBadge";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseEther, formatEther, decodeEventLog } from "viem";
import { FACTORY_ADDRESS, FACTORY_ABI, USE_V4 } from "../config/contracts";
import { ConnectButton } from "@rainbow-me/rainbowkit";

type Chain = "ethereum" | "base" | "robinhood" | "bsc" | "solana";

export default function LaunchPage() {
  const { address, isConnected } = useAccount();
  const [selectedChain, setSelectedChain] = useState<Chain>("ethereum");
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    description: "",
    totalSupply: "1000000",
    decimals: "18",
    tokenForLP: "500000", // v4 only
    ethForLP: "1", // v4 only
    website: "",
    twitter: "",
    telegram: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [deployedToken, setDeployedToken] = useState<string | null>(null);
  const [poolId, setPoolId] = useState<string | null>(null);
  const [positionNFT, setPositionNFT] = useState<string | null>(null);

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash,
  });

  const { data: launchFee } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: FACTORY_ABI,
    functionName: "launchFee",
  });

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
    
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (FACTORY_ADDRESS === "0x0000000000000000000000000000000000000000") {
      alert("Factory contract not deployed yet. Please check .env configuration.");
      return;
    }

    try {
      const fee = launchFee || parseEther("0.001");
      
      if (USE_V4) {
        // RealV4Launcher with liquidity
        const ethLiquidityValue = parseEther(formData.ethForLP);
        const totalValue = fee + ethLiquidityValue;
        
        // Calculate sqrt price for 1:1 (simplified)
        const sqrtPriceX96 = BigInt("79228162514264337593543950336"); // 1:1 price
        
        writeContract({
          address: FACTORY_ADDRESS,
          abi: FACTORY_ABI,
          functionName: "launchToken",
          args: [
            formData.name,
            formData.symbol,
            BigInt(formData.totalSupply),
            Number(formData.decimals),
            BigInt(formData.tokenForLP),
            sqrtPriceX96,
            -60, // tickLower (one tick below current)
            60,  // tickUpper (one tick above current)
          ],
          value: totalValue,
        });
      } else {
        // SimpleTokenFactory (no pool)
        writeContract({
          address: FACTORY_ADDRESS,
          abi: FACTORY_ABI,
          functionName: "launchToken",
          args: [
            formData.name,
            formData.symbol,
            BigInt(formData.totalSupply),
            Number(formData.decimals),
          ],
          value: fee,
        });
      }
    } catch (error) {
      console.error("Launch error:", error);
    }
  };

  // Parse logs when transaction succeeds
  if (isSuccess && receipt && !deployedToken) {
    try {
      const tokenLaunchedLog = receipt.logs.find((log) => {
        try {
          const decoded = decodeEventLog({
            abi: FACTORY_ABI,
            data: log.data,
            topics: log.topics,
          });
          return decoded.eventName === "TokenLaunched";
        } catch {
          return false;
        }
      });

      if (tokenLaunchedLog) {
        const decoded = decodeEventLog({
          abi: FACTORY_ABI,
          data: tokenLaunchedLog.data,
          topics: tokenLaunchedLog.topics,
        }) as any;
        
        if (USE_V4) {
          setDeployedToken(decoded.args.token);
          setPoolId(decoded.args.poolId);
          setPositionNFT(decoded.args.positionTokenId?.toString());
        } else {
          setDeployedToken(decoded.args.tokenAddress);
        }
      }
    } catch (error) {
      console.error("Error parsing logs:", error);
    }
  }

  const estimatedFee = launchFee ? `${formatEther(launchFee)} ETH` : "0.001 ETH";
  const totalCost = USE_V4 
    ? (launchFee ? formatEther(launchFee + parseEther(formData.ethForLP || "0")) : `${parseFloat(formData.ethForLP || "0") + 0.001} ETH`)
    : estimatedFee;
  const isFormValid = formData.name && formData.symbol && formData.description && formData.totalSupply && 
    (!USE_V4 || (formData.tokenForLP && formData.ethForLP));

  const getExplorerUrl = (txHash: string) => {
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "1";
    if (chainId === "11155111") {
      return `https://sepolia.etherscan.io/tx/${txHash}`;
    }
    return `https://etherscan.io/tx/${txHash}`;
  };

  const getTokenExplorerUrl = (tokenAddress: string) => {
    const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || "1";
    if (chainId === "11155111") {
      return `https://sepolia.etherscan.io/address/${tokenAddress}`;
    }
    return `https://etherscan.io/address/${tokenAddress}`;
  };

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4">Launch Your Token</h1>
          <p className="text-xl text-zinc-400">
            Create your token on Ethereum. Multichain expansion coming soon.
          </p>
        </div>
        
        {!isConnected ? (
          <div className="bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border-2 border-violet-500 rounded-2xl p-12 text-center glow-effect">
            <div className="text-6xl mb-6">🔐</div>
            <h2 className="text-3xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-zinc-300 mb-6">
              Please connect your wallet to launch a token on Ethereum.
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </div>
        ) : isSuccess && hash ? (
          <div className="bg-gradient-to-r from-violet-500/20 to-cyan-500/20 border-2 border-violet-500 rounded-2xl p-12 text-center glow-effect">
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold mb-4">Token Launched Successfully!</h2>
            <p className="text-zinc-300 mb-6">
              Your token <span className="font-bold text-white">{formData.symbol}</span> is now live on Ethereum.
              {USE_V4 && poolId && " Uniswap v4 pool created with initial liquidity!"}
            </p>
            <div className="space-y-2 text-sm text-zinc-400 mb-6">
              <p>Transaction: <a href={getExplorerUrl(hash)} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">View on Explorer</a></p>
              {deployedToken && (
                <p>Token Contract: <a href={getTokenExplorerUrl(deployedToken)} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">{deployedToken.slice(0, 10)}...{deployedToken.slice(-8)}</a></p>
              )}
              {USE_V4 && poolId && (
                <>
                  <p>Pool ID: <span className="font-mono text-xs">{poolId.slice(0, 16)}...{poolId.slice(-8)}</span></p>
                  {positionNFT && <p>Position NFT: #{positionNFT}</p>}
                </>
              )}
            </div>
            <button
              onClick={() => {
                setFormData({ name: "", symbol: "", description: "", totalSupply: "1000000", decimals: "18", tokenForLP: "500000", ethForLP: "1", website: "", twitter: "", telegram: "" });
                setImagePreview(null);
                setDeployedToken(null);
                setPoolId(null);
                setPositionNFT(null);
              }}
              className="px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-violet-500/50 transition-all hover:scale-[1.02]"
            >
              Launch Another Token
            </button>
          </div>
        ) : (
          <form onSubmit={handleLaunch} className="space-y-8">
            {writeError && (
              <div className="bg-red-500/10 border-2 border-red-500 rounded-2xl p-6 text-center">
                <p className="text-red-400">
                  Error: {writeError.message.split('\n')[0]}
                </p>
              </div>
            )}

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
                      maxLength={10}
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Total Supply *</label>
                    <input
                      type="number"
                      value={formData.totalSupply}
                      onChange={(e) => setFormData({ ...formData, totalSupply: e.target.value })}
                      placeholder="1000000"
                      min="1"
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                      required
                    />
                    <p className="text-xs text-zinc-500 mt-1">Total number of tokens (before decimals)</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Decimals *</label>
                    <select
                      value={formData.decimals}
                      onChange={(e) => setFormData({ ...formData, decimals: e.target.value })}
                      className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                      required
                    >
                      <option value="6">6 (USDC-style)</option>
                      <option value="18">18 (ETH-style, recommended)</option>
                    </select>
                  </div>
                </div>
                
                {USE_V4 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Tokens for Liquidity Pool *</label>
                      <input
                        type="number"
                        value={formData.tokenForLP}
                        onChange={(e) => setFormData({ ...formData, tokenForLP: e.target.value })}
                        placeholder="500000"
                        min="1"
                        max={formData.totalSupply}
                        className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                        required
                      />
                      <p className="text-xs text-zinc-500 mt-1">Amount of tokens to add to Uniswap v4 pool</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">ETH for Liquidity Pool *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.ethForLP}
                        onChange={(e) => setFormData({ ...formData, ethForLP: e.target.value })}
                        placeholder="1.0"
                        min="0.01"
                        className="w-full px-4 py-3 bg-black border border-white/20 rounded-lg focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                        required
                      />
                      <p className="text-xs text-zinc-500 mt-1">ETH amount for initial liquidity (in addition to launch fee)</p>
                    </div>
                  </>
                )}
                
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
                  <p className="text-xs text-zinc-500 mt-1">Image is stored off-chain for display purposes</p>
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
                  <div className="text-sm text-zinc-400 mb-1">{USE_V4 ? "Total Cost" : "Launch Fee"}</div>
                  <div className="text-3xl font-bold">{totalCost}</div>
                  {USE_V4 && (
                    <div className="text-xs text-zinc-500 mt-1">
                      {estimatedFee} fee + {formData.ethForLP} ETH liquidity
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-zinc-400 mb-1">Plus Gas</div>
                  <div className="text-lg text-zinc-300">~$10-30</div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!isFormValid || isPending || isConfirming}
                className="w-full px-8 py-4 bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-violet-500/50 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isPending ? "Waiting for approval..." : isConfirming ? "Launching..." : "Launch Token"}
              </button>
              
              <p className="text-xs text-zinc-500 mt-4 text-center">
                {USE_V4 
                  ? "By launching, you create an ERC-20 token + Uniswap v4 pool with initial liquidity. You receive the position NFT and remaining tokens."
                  : "By launching, you create an ERC-20 token on Ethereum. Total supply will be sent to your wallet."
                }
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

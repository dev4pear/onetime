type Chain = "ethereum" | "base" | "robinhood" | "bsc" | "solana";

interface ChainBadgeProps {
  chain: Chain;
  live?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const chainConfig: Record<Chain, { name: string; color: string; icon: string }> = {
  ethereum: { name: "Ethereum", color: "from-blue-500 to-purple-500", icon: "Ξ" },
  base: { name: "Base", color: "from-blue-600 to-blue-400", icon: "B" },
  robinhood: { name: "Robinhood", color: "from-green-500 to-emerald-400", icon: "R" },
  bsc: { name: "BSC", color: "from-yellow-500 to-yellow-400", icon: "B" },
  solana: { name: "Solana", color: "from-purple-600 to-pink-500", icon: "S" },
};

export default function ChainBadge({ chain, live = false, size = "md", showLabel = true }: ChainBadgeProps) {
  const config = chainConfig[chain];
  const sizeClasses = {
    sm: "w-6 h-6 text-xs",
    md: "w-8 h-8 text-sm",
    lg: "w-12 h-12 text-lg",
  };
  
  return (
    <div className={`flex items-center space-x-2 ${!live && "opacity-40"}`}>
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center font-bold ${!live && "grayscale"}`}>
        {config.icon}
      </div>
      {showLabel && (
        <div>
          <div className="text-sm font-medium">{config.name}</div>
          {!live && <div className="text-xs text-zinc-500">Coming soon</div>}
        </div>
      )}
    </div>
  );
}

export function ChainSelector({ 
  selected, 
  onChange 
}: { 
  selected: Chain; 
  onChange: (chain: Chain) => void 
}) {
  const chains: Array<{ chain: Chain; live: boolean }> = [
    { chain: "ethereum", live: true },
    { chain: "base", live: false },
    { chain: "robinhood", live: false },
    { chain: "bsc", live: false },
    { chain: "solana", live: false },
  ];
  
  return (
    <div className="space-y-2">
      {chains.map(({ chain, live }) => {
        const config = chainConfig[chain];
        const isSelected = selected === chain;
        
        return (
          <button
            key={chain}
            onClick={() => live && onChange(chain)}
            disabled={!live}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              isSelected 
                ? "border-violet-500 bg-violet-500/10" 
                : live 
                  ? "border-white/10 hover:border-white/20 bg-white/5" 
                  : "border-white/5 bg-white/5 cursor-not-allowed"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center font-bold ${!live && "grayscale opacity-50"}`}>
                {config.icon}
              </div>
              <div className="text-left">
                <div className="font-medium">{config.name}</div>
                {!live && <div className="text-xs text-zinc-500">Coming soon</div>}
                {live && <div className="text-xs text-green-400">Live</div>}
              </div>
            </div>
            {isSelected && live && (
              <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

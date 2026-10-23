export default function DocsPage() {
  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Documentation</h1>
          <p className="text-xl text-zinc-400">
            Everything you need to know about launching on ONETIME
          </p>
        </div>
        
        <div className="space-y-12 prose prose-invert prose-lg max-w-none">
          {/* How It Works */}
          <Section id="how-it-works" title="How It Works">
            <p className="text-zinc-300">
              ONETIME is a multichain token launchpad that allows you to deploy your token once 
              and have it available across multiple blockchains with the same name and symbol.
            </p>
            
            <h3 className="text-2xl font-bold mt-8 mb-4">Phase 1: Ethereum Launch</h3>
            <p className="text-zinc-300">
              Currently, ONETIME supports launching tokens on Ethereum mainnet. When you launch 
              your token:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
              <li>Your token is deployed to Ethereum with a Uniswap v4 liquidity pool</li>
              <li>Your token name and symbol are reserved across all supported chains</li>
              <li>You receive exclusive rights to expand to other chains when you&apos;re ready</li>
              <li>No one else can deploy a token with your name on supported chains</li>
            </ul>
            
            <h3 className="text-2xl font-bold mt-8 mb-4">Phase 2: Multichain Expansion</h3>
            <p className="text-zinc-300">
              Coming soon, you&apos;ll be able to expand your token to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
              <li><strong>Base</strong> - Coinbase&apos;s L2 network</li>
              <li><strong>Robinhood Chain</strong> - Robinhood&apos;s new blockchain</li>
              <li><strong>BSC</strong> - Binance Smart Chain</li>
              <li><strong>Solana</strong> - High-performance blockchain</li>
            </ul>
          </Section>
          
          {/* Technical Architecture */}
          <Section id="architecture" title="Technical Architecture">
            <p className="text-zinc-300">
              ONETIME uses a combination of Uniswap v4 hooks and LayerZero OFT (Omnichain Fungible Token) 
              infrastructure to enable seamless cross-chain token transfers.
            </p>
            
            <h3 className="text-2xl font-bold mt-8 mb-4">Unified Liquidity</h3>
            <p className="text-zinc-300">
              Instead of fragmenting liquidity across chains, ONETIME maintains a unified liquidity 
              pool that&apos;s accessible from any supported chain. This means:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-300 ml-4">
              <li>Better price discovery</li>
              <li>Lower slippage for traders</li>
              <li>More efficient capital utilization</li>
            </ul>
            
            <h3 className="text-2xl font-bold mt-8 mb-4">Cross-Chain Messaging</h3>
            <p className="text-zinc-300">
              When a user wants to move tokens between chains, ONETIME uses LayerZero to:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-zinc-300 ml-4">
              <li>Burn tokens on the source chain</li>
              <li>Send a message to the destination chain</li>
              <li>Mint equivalent tokens on the destination chain</li>
            </ol>
            <p className="text-zinc-300 mt-4">
              This happens in a single transaction from the user&apos;s perspective.
            </p>
          </Section>
          
          {/* Fees */}
          <Section id="fees" title="Fees">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-2xl font-bold mb-4">Launch Fees</h3>
              <div className="space-y-4">
                <FeeRow 
                  label="Initial Launch (Ethereum)"
                  amount="0.05 ETH"
                  description="One-time fee to deploy your token and reserve your name across all chains"
                />
                <FeeRow 
                  label="Chain Expansion"
                  amount="0.01 ETH per chain"
                  description="Fee to activate your token on additional chains (coming soon)"
                />
                <FeeRow 
                  label="Trading Fees"
                  amount="0.3%"
                  description="Standard Uniswap v4 trading fee split between LPs and protocol"
                />
              </div>
            </div>
            
            <p className="text-zinc-400 text-sm mt-4">
              * Fees are subject to change. Gas fees are additional and depend on network conditions.
            </p>
          </Section>
          
          {/* Roadmap */}
          <Section id="roadmap" title="Roadmap">
            <div className="space-y-6">
              <RoadmapItem 
                status="completed"
                title="Q4 2026: Ethereum Launch"
                items={[
                  "Token deployment on Ethereum mainnet",
                  "Uniswap v4 integration",
                  "Name reservation system",
                  "Web interface launch"
                ]}
              />
              
              <RoadmapItem 
                status="in-progress"
                title="Q1 2027: Base Integration"
                items={[
                  "Base mainnet deployment",
                  "Cross-chain bridging",
                  "Unified liquidity pools",
                  "Mobile-optimized interface"
                ]}
              />
              
              <RoadmapItem 
                status="planned"
                title="Q2 2027: Multi-Chain Expansion"
                items={[
                  "Robinhood Chain integration",
                  "BSC deployment",
                  "Solana support",
                  "Advanced analytics dashboard"
                ]}
              />
              
              <RoadmapItem 
                status="planned"
                title="Q3 2027: DeFi Ecosystem"
                items={[
                  "Lending/borrowing integration",
                  "Governance token launch",
                  "DAO formation",
                  "Advanced trading features"
                ]}
              />
            </div>
          </Section>
          
          {/* FAQ */}
          <Section id="faq" title="FAQ">
            <div className="space-y-6">
              <FAQItem 
                question="Why can't I launch on other chains yet?"
                answer="We're currently in Phase 1, focusing on Ethereum. We want to ensure the core infrastructure is solid before expanding to other chains. Base, Robinhood, BSC, and Solana support is coming in Q1-Q2 2027."
              />
              
              <FAQItem 
                question="What happens if someone tries to copy my token on another chain?"
                answer="When you launch on ONETIME, we reserve your token name and symbol across all supported chains. No one else will be able to deploy a token with your exact name and symbol on any chain we support."
              />
              
              <FAQItem 
                question="Can I add liquidity to my token?"
                answer="Yes! After launching, your token automatically gets a Uniswap v4 pool. You can add liquidity through the standard Uniswap interface."
              />
              
              <FAQItem 
                question="What's the difference between ONETIME and regular token launches?"
                answer="Traditional token launches require deploying separately on each chain, fragmenting liquidity and creating opportunities for copycats. ONETIME lets you launch once and expand everywhere while maintaining unified liquidity."
              />
              
              <FAQItem 
                question="Do I need a wallet to launch?"
                answer="Yes, you'll need a Web3 wallet (like MetaMask) with enough ETH to cover the launch fee plus gas costs. In the future, we'll support more wallet providers and payment methods."
              />
              
              <FAQItem 
                question="Can I edit my token details after launch?"
                answer="Token name, symbol, and supply cannot be changed after launch (they're immutable on-chain). However, you can update metadata like description, social links, and images through our platform."
              />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-4xl font-bold mb-6 gradient-text">{title}</h2>
      {children}
    </section>
  );
}

function FeeRow({ label, amount, description }: { label: string; amount: string; description: string }) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="font-semibold mb-1">{label}</div>
        <div className="text-sm text-zinc-400">{description}</div>
      </div>
      <div className="text-xl font-bold text-violet-400 ml-4">{amount}</div>
    </div>
  );
}

function RoadmapItem({ 
  status, 
  title, 
  items 
}: { 
  status: "completed" | "in-progress" | "planned"; 
  title: string; 
  items: string[] 
}) {
  const statusConfig = {
    completed: { color: "bg-green-500", label: "Completed" },
    "in-progress": { color: "bg-yellow-500", label: "In Progress" },
    planned: { color: "bg-zinc-500", label: "Planned" },
  };
  
  const config = statusConfig[status];
  
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-3 h-3 rounded-full ${config.color}`} />
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">{config.label}</span>
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start space-x-2 text-zinc-300">
            <span className="text-violet-400 mt-1">→</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-xl font-semibold mb-3">{question}</h3>
      <p className="text-zinc-300 leading-relaxed">{answer}</p>
    </div>
  );
}

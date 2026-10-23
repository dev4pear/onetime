# ONETIME - One Launch. Every Chain.

Real token launchpad for Ethereum with Uniswap v4 roadmap.

## Features

✅ **Real ERC-20 Token Deployment** - Deploy standard tokens on Ethereum (WORKS)  
✅ **Wallet Integration** - Connect with MetaMask, Rainbow, WalletConnect (WORKS)  
✅ **On-Chain Transactions** - All launches are real blockchain transactions (WORKS)  
✅ **Etherscan Integration** - View tokens and transactions on block explorer (WORKS)  
🚧 **Uniswap v4 Pools** - Pool initialization works, liquidity provision incomplete (see contracts/STATUS.md)  
🚧 **Multichain** - Base, Robinhood, BSC, Solana (coming soon)

**Honest status:** Token deployment is production-ready. Uniswap v4 automated liquidity needs 1-2 days more work.

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your settings (see below)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Setup

Create `.env.local`:

```env
# Network (1 = Ethereum Mainnet, 11155111 = Sepolia Testnet)
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY

# Deployed factory contract address
NEXT_PUBLIC_FACTORY_ADDRESS=0x...

# WalletConnect Project ID (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide covering:
- Smart contract deployment to Sepolia/Mainnet
- Frontend configuration
- Environment variables
- Verification steps

### Quick Deploy to Sepolia

```bash
# Deploy contracts
cd contracts
forge script script/DeployFactory.s.sol:DeployFactory \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify

# Configure frontend with deployed address
cd ..
echo "NEXT_PUBLIC_FACTORY_ADDRESS=0x..." >> .env.local

# Test
npm run dev
```

## Architecture

### Smart Contracts (`/contracts`)

- **LaunchToken.sol**: Standard ERC-20 with configurable decimals
- **SimpleTokenFactory.sol**: Factory for deploying tokens (active)
- **TokenLaunchFactory.sol**: Extended factory with Uniswap v4 hooks (in progress)

Built with:
- Foundry
- OpenZeppelin Contracts
- Uniswap v4 Core (dependency)

### Frontend (`/app`)

- Next.js 16 (App Router)
- Tailwind CSS 4
- Wagmi + Viem (Ethereum interactions)
- RainbowKit (wallet connection)

## How It Works

1. **User connects wallet** via RainbowKit (MetaMask, Rainbow, WalletConnect, etc.)
2. **Fill token details**: name, symbol, supply, decimals
3. **Pay launch fee**: Small ETH fee (e.g., 0.001 ETH on testnet)
4. **Sign transaction**: Wallet prompts for approval
5. **Token deployed**: Factory deploys ERC-20, mints supply to user
6. **View on explorer**: Get contract address and Etherscan link

## Development

### Project Structure

```
/workspace
├── app/                    # Next.js frontend
│   ├── config/            # Wagmi, contracts config
│   ├── providers/         # Web3 providers
│   ├── components/        # React components
│   ├── launch/           # Token launch page
│   └── ...
├── contracts/             # Smart contracts
│   ├── src/              # Solidity contracts
│   ├── script/           # Deployment scripts
│   ├── test/             # Contract tests
│   └── foundry.toml
├── .env.example          # Frontend env template
└── DEPLOYMENT.md         # Deployment guide
```

### Build & Test

```bash
# Frontend
npm run build
npm run lint

# Smart contracts
cd contracts
forge build
forge test
forge test --gas-report
```

## Uniswap v4 Integration

**Status**: Framework in place, awaiting v4 mainnet launch

Current `TokenLaunchFactory.sol` includes:
- PoolManager interfaces
- Pool key generation
- Currency ordering (ETH/WETH pairs)
- Sqrt price calculations

**To complete**:
1. Uniswap v4 goes live on mainnet
2. Integrate PositionManager for liquidity
3. Handle pool initialization
4. Add liquidity provision flow
5. Test on live v4 contracts

See `contracts/README.md` for details.

## Roadmap

- [x] ERC-20 token deployment
- [x] Wallet integration (RainbowKit)
- [x] Ethereum mainnet/testnet support
- [x] Transaction tracking & explorer links
- [x] Launch fee mechanism
- [ ] Uniswap v4 pool creation
- [ ] Initial liquidity provision
- [ ] Base network support
- [ ] Robinhood network support
- [ ] BSC network support
- [ ] Solana network support
- [ ] Token registry & discovery
- [ ] Advanced tokenomics (vesting, etc.)

## Configuration

### Supported Networks

| Network | Chain ID | Status |
|---------|----------|--------|
| Ethereum Mainnet | 1 | ✅ Active |
| Sepolia Testnet | 11155111 | ✅ Active |
| Base | 8453 | 🚧 Coming Soon |
| Robinhood | TBD | 🚧 Coming Soon |
| BSC | 56 | 🚧 Coming Soon |
| Solana | N/A | 🚧 Coming Soon |

### Launch Fees

- **Testnet (Sepolia)**: 0.001 ETH
- **Mainnet**: 0.01 ETH (recommended)

Configurable in factory deployment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on Sepolia
5. Submit a pull request

## Security

- Standard ERC-20 (OpenZeppelin)
- No admin minting
- Launch fee prevents spam
- Supply minted to creator
- Open source & verifiable

**Production**: Consider professional audit before significant usage.

## License

MIT

## Support

- [Documentation](./DEPLOYMENT.md)
- [Smart Contracts](./contracts/README.md)
- [Issues](https://github.com/dev4pear/onetime/issues)

---

Built for the decentralized future. One launch. Every chain.

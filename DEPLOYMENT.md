# ONETIME Deployment Guide

This guide walks through deploying ONETIME to production or testing on Sepolia testnet.

## Prerequisites

1. **Foundry** (for smart contracts)
```bash
curl -L https://foundry.paradigm.xyz/foundry.sh | bash
foundryup
```

2. **Node.js 18+** and npm

3. **Wallets & Keys**:
   - Deployer wallet with ETH for gas
   - Treasury wallet address
   - Alchemy or Infura RPC API key
   - Etherscan API key
   - WalletConnect Project ID

## Quick Start (Sepolia Testnet)

### 1. Deploy Smart Contracts

```bash
cd contracts

# Copy and configure environment
cp .env.example .env
# Edit .env:
# - PRIVATE_KEY: your deployer private key
# - TREASURY_ADDRESS: address to receive launch fees
# - LAUNCH_FEE: 1000000000000000 (0.001 ETH for testing)
# - SEPOLIA_RPC_URL: your Alchemy/Infura Sepolia RPC
# - ETHERSCAN_API_KEY: for contract verification

# Deploy factory
forge script script/DeployFactory.s.sol:DeployFactory \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  -vvvv

# Note the deployed factory address from the output
```

### 2. Configure Frontend

```bash
cd ..  # back to project root

# Copy and configure environment
cp .env.example .env.local
# Edit .env.local:
# - NEXT_PUBLIC_CHAIN_ID=11155111 (Sepolia)
# - NEXT_PUBLIC_RPC_URL: your Sepolia RPC URL
# - NEXT_PUBLIC_FACTORY_ADDRESS: deployed factory address from step 1
# - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: from https://cloud.walletconnect.com
```

### 3. Run Development Server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and test:
- Connect wallet (switch to Sepolia network)
- Launch a test token
- Verify transaction on Sepolia Etherscan

### 4. Build for Production

```bash
npm run build
npm run start
```

## Production Deployment (Ethereum Mainnet)

### 1. Deploy Contracts to Mainnet

```bash
cd contracts

# Update .env for mainnet:
# - LAUNCH_FEE: 10000000000000000 (0.01 ETH recommended)
# - MAINNET_RPC_URL: your mainnet RPC
# - Same PRIVATE_KEY and TREASURY_ADDRESS

forge script script/DeployFactory.s.sol:DeployFactory \
  --rpc-url $MAINNET_RPC_URL \
  --broadcast \
  --verify \
  -vvvv
```

**⚠️ IMPORTANT**: 
- Test thoroughly on Sepolia first
- Verify contract on Etherscan
- Check treasury address is correct
- Ensure deployer wallet has sufficient ETH for gas

### 2. Configure Production Frontend

```bash
cd ..

# Edit .env.local for mainnet:
# - NEXT_PUBLIC_CHAIN_ID=1
# - NEXT_PUBLIC_RPC_URL: mainnet RPC
# - NEXT_PUBLIC_FACTORY_ADDRESS: mainnet factory address
# - NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: production project ID
```

### 3. Deploy Frontend

Deploy to Vercel, Netlify, or your preferred hosting:

```bash
# Build
npm run build

# The .next folder contains the production build
# Deploy according to your hosting provider's instructions
```

**Vercel (Recommended)**:
```bash
npm install -g vercel
vercel --prod
```

Add environment variables in Vercel dashboard:
- `NEXT_PUBLIC_CHAIN_ID`
- `NEXT_PUBLIC_RPC_URL`
- `NEXT_PUBLIC_FACTORY_ADDRESS`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

## Environment Variables Reference

### Smart Contracts (`contracts/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PRIVATE_KEY` | Deployer wallet private key | `0x...` |
| `TREASURY_ADDRESS` | Receives launch fees | `0x742d...` |
| `LAUNCH_FEE` | Fee to launch a token (wei) | `10000000000000000` (0.01 ETH) |
| `MAINNET_RPC_URL` | Ethereum mainnet RPC | `https://eth-mainnet.g.alchemy.com/v2/...` |
| `SEPOLIA_RPC_URL` | Sepolia testnet RPC | `https://eth-sepolia.g.alchemy.com/v2/...` |
| `ETHERSCAN_API_KEY` | For contract verification | `ABC123...` |

### Frontend (`.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_CHAIN_ID` | Network (1=mainnet, 11155111=Sepolia) | `1` |
| `NEXT_PUBLIC_RPC_URL` | Public RPC endpoint | `https://eth-mainnet.g.alchemy.com/v2/...` |
| `NEXT_PUBLIC_FACTORY_ADDRESS` | Deployed factory address | `0x...` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project | `abc...` |

## Verification

After deployment, verify:

1. **Smart Contract**:
   - View on Etherscan
   - Check verified source code
   - Read `launchFee` and `treasury` values

2. **Frontend**:
   - Connect wallet shows correct network
   - Launch form works end-to-end
   - Transaction links point to correct explorer
   - Deployed tokens appear on explorer

3. **Integration**:
   - Launch a test token
   - Verify total supply in creator wallet
   - Check treasury received launch fee
   - Confirm token is tradeable

## Troubleshooting

### "Factory contract not deployed"
- Check `NEXT_PUBLIC_FACTORY_ADDRESS` is set
- Ensure address format is `0x...`
- Verify contract is deployed on the network matching `NEXT_PUBLIC_CHAIN_ID`

### "Insufficient funds" or high gas
- Ensure deployer wallet has enough ETH
- Check current gas prices
- For mainnet, consider deploying during low-traffic times

### Contract verification failed
- Check `ETHERSCAN_API_KEY` is valid
- Verify compiler version matches (`0.8.26`)
- Try manual verification on Etherscan

### Wallet won't connect
- Check `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set
- Ensure user is on correct network
- Try different wallet (MetaMask, Rainbow, etc.)

## Uniswap v4 Integration (Future)

Current implementation deploys ERC-20 tokens. To add Uniswap v4 pools:

1. Wait for Uniswap v4 mainnet deployment
2. Update `TokenLaunchFactory.sol` with live addresses
3. Integrate v4 PositionManager for liquidity
4. Test on v4 testnet deployments
5. Add pool initialization to launch flow

See `contracts/src/TokenLaunchFactory.sol` for v4 foundation.

## Security Considerations

- **Private Keys**: Never commit to git. Use `.gitignore`.
- **Launch Fee**: Set reasonably to prevent spam but not exclude users.
- **Treasury**: Use a multisig or secure wallet.
- **Rate Limiting**: Consider adding if spam becomes an issue.
- **Audits**: For production with significant value, get contracts audited.

## Support

For issues:
1. Check contract logs on Etherscan
2. Review transaction errors
3. Test on Sepolia first
4. Open GitHub issue with details

## License

MIT - see LICENSE file

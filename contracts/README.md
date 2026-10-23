# ONETIME Smart Contracts

Smart contracts for the ONETIME token launchpad.

## Overview

- **LaunchToken.sol**: ✅ Standard ERC-20 token (production ready)
- **SimpleTokenFactory.sol**: ✅ Factory that deploys tokens (production ready)
- **V4TokenLauncher.sol**: 🚧 Pool init works, liquidity provision incomplete (see STATUS.md)

**See [STATUS.md](./STATUS.md) for honest implementation status.**

## Deployed Addresses

### Ethereum Mainnet
- SimpleTokenFactory: `TBD`

### Sepolia Testnet
- SimpleTokenFactory: `TBD`

## Setup

1. Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz/foundry.sh | bash
foundryup
```

2. Install dependencies:
```bash
forge install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Configure `.env` with your keys

## Build & Test

```bash
# Compile contracts
forge build

# Run tests
forge test

# Run tests with gas reporting
forge test --gas-report
```

## Deployment

### Deploy to Sepolia (Testnet)

```bash
# Set LAUNCH_FEE=0.001 ETH (1000000000000000 wei)
forge script script/DeployFactory.s.sol:DeployFactory \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  -vvvv
```

### Deploy to Mainnet

```bash
# Set LAUNCH_FEE=0.01 ETH (10000000000000000 wei) or desired amount
forge script script/DeployFactory.s.sol:DeployFactory \
  --rpc-url $MAINNET_RPC_URL \
  --broadcast \
  --verify \
  -vvvv
```

## Contract Interaction

### Launch a Token

```solidity
// Get the launch fee
uint256 fee = factory.launchFee();

// Launch token
address tokenAddress = factory.launchToken{value: fee}(
    "My Token",      // name
    "MTK",           // symbol
    1000000,         // total supply (before decimals)
    18               // decimals
);
```

## Uniswap v4 Integration (Planned)

The `TokenLaunchFactory.sol` contract contains the foundation for Uniswap v4 integration:

- Pool creation via PoolManager
- Initial liquidity provision
- Automated market making

**Status**: Framework in place, requires:
1. Uniswap v4 deployment on mainnet
2. Position manager integration
3. Liquidity provision flow
4. Testing with live v4 contracts

## Security Notes

- All contracts use OpenZeppelin libraries
- Launch fee prevents spam
- Total supply minted to creator
- No admin minting capabilities
- Standard ERC-20 implementation

## Testing Checklist

- [ ] Token deployment works
- [ ] Launch fee is correctly charged
- [ ] Total supply is minted to creator
- [ ] Multiple tokens can be launched
- [ ] Events are emitted correctly
- [ ] Treasury receives fees

## License

MIT

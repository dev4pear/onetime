# Real Fork Test Instructions

## Test is REQUIRED to run (no more skipping)

The `test_launchToken` fork test now **requires** a real Sepolia RPC URL and will **fail clearly** if not provided.

## Running the Test

### 1. Get a Sepolia RPC URL
- Alchemy: https://www.alchemy.com/
- Infura: https://www.infura.io/
- Or any other RPC provider

### 2. Set Environment Variable
```bash
export SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY"
```

### 3. Run the Test
```bash
cd contracts
forge test --match-test test_launchToken --fork-url $SEPOLIA_RPC_URL -vv
```

## What the Test Verifies

```solidity
✅ Token deployed (ERC-20 with correct name/symbol/decimals)
✅ Pool initialized on Uniswap v4 (sqrtPriceX96 > 0)
✅ Position NFT minted to creator (IERC721.ownerOf == creator)
✅ Remaining tokens transferred to creator
✅ Treasury received launch fee
```

## Expected Output

```
[PASS] test_launchToken() (gas: ~5,000,000)
Logs:
  Token deployed: 0x...
  Pool sqrtPrice: 79228162514264337593543950336
  Position NFT: 1
```

## Test Code Location

`contracts/test/RealV4Launcher.t.sol` lines 62-118

## Addresses Used (Official from developers.uniswap.org)

**Sepolia:**
- PoolManager: `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543`
- PositionManager: `0x429ba70129df741B2Ca2a85BC3A2a3328e5c09b4`

**Mainnet:**
- PoolManager: `0x000000000004444c5dc75cB358380D2e3dE08A90`
- PositionManager: `0xbD216513d74C8cf14cf4747E6AaA6420FF64ee9e`

## Build Requirements

```bash
forge build  # Uses via_ir=true to avoid stack too deep
```

All contracts compile successfully with warnings (linting only, no errors).

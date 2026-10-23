export const FACTORY_ADDRESS = (process.env.NEXT_PUBLIC_FACTORY_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`;
export const USE_V4 = process.env.NEXT_PUBLIC_USE_V4 === 'true';

// SimpleTokenFactory ABI (no v4)
export const SIMPLE_FACTORY_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "_launchFee", "type": "uint256" },
      { "internalType": "address", "name": "_treasury", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "InsufficientFee",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidSupply",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "tokenAddress", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "name", "type": "string" },
      { "indexed": false, "internalType": "string", "name": "symbol", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "totalSupply", "type": "uint256" },
      { "indexed": false, "internalType": "uint8", "name": "decimals", "type": "uint8" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "TokenLaunched",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "symbol", "type": "string" },
      { "internalType": "uint256", "name": "totalSupply", "type": "uint256" },
      { "internalType": "uint8", "name": "decimals", "type": "uint8" }
    ],
    "name": "launchToken",
    "outputs": [
      { "internalType": "address", "name": "tokenAddress", "type": "address" }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "launchFee",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalTokens",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "tokenAddress", "type": "address" }
    ],
    "name": "getTokenInfo",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "tokenAddress", "type": "address" },
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "string", "name": "symbol", "type": "string" },
          { "internalType": "uint256", "name": "totalSupply", "type": "uint256" },
          { "internalType": "uint8", "name": "decimals", "type": "uint8" },
          { "internalType": "address", "name": "creator", "type": "address" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct SimpleTokenFactory.TokenInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// RealV4Launcher ABI (with v4 pools + liquidity)
export const V4_LAUNCHER_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_poolManager", "type": "address" },
      { "internalType": "address", "name": "_positionManager", "type": "address" },
      { "internalType": "uint256", "name": "_launchFee", "type": "uint256" },
      { "internalType": "address", "name": "_treasury", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "InsufficientETH",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidSupply",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "creator", "type": "address" },
      { "indexed": true, "internalType": "address", "name": "token", "type": "address" },
      { "indexed": true, "internalType": "PoolId", "name": "poolId", "type": "bytes32" },
      { "indexed": false, "internalType": "uint256", "name": "positionTokenId", "type": "uint256" }
    ],
    "name": "TokenLaunched",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "name", "type": "string" },
      { "internalType": "string", "name": "symbol", "type": "string" },
      { "internalType": "uint256", "name": "totalSupply", "type": "uint256" },
      { "internalType": "uint8", "name": "decimals", "type": "uint8" },
      { "internalType": "uint256", "name": "tokenAmountForLP", "type": "uint256" },
      { "internalType": "uint160", "name": "sqrtPriceX96", "type": "uint160" },
      { "internalType": "int24", "name": "tickLower", "type": "int24" },
      { "internalType": "int24", "name": "tickUpper", "type": "int24" }
    ],
    "name": "launchToken",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "token", "type": "address" },
          { "internalType": "PoolId", "name": "poolId", "type": "bytes32" },
          { "internalType": "uint256", "name": "positionTokenId", "type": "uint256" }
        ],
        "internalType": "struct RealV4Launcher.LaunchResult",
        "name": "result",
        "type": "tuple"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "launchFee",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const FACTORY_ABI = USE_V4 ? V4_LAUNCHER_ABI : SIMPLE_FACTORY_ABI;

export const ERC20_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" }
    ],
    "name": "balanceOf",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      { "internalType": "uint8", "name": "", "type": "uint8" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

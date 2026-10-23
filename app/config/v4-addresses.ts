// Official Uniswap v4 addresses from developers.uniswap.org

export const V4_ADDRESSES = {
  mainnet: {
    poolManager: '0x000000000004444c5dc75cB358380D2e3dE08A90' as `0x${string}`,
    positionManager: '0xbD216513d74C8cf14cf4747E6AaA6420FF64ee9e' as `0x${string}`,
  },
  sepolia: {
    poolManager: '0xE03A1074c86CFeDd5C142C4F04F1a1536e203543' as `0x${string}`,
    positionManager: '0x429ba70129df741B2Ca2a85BC3A2a3328e5c09b4' as `0x${string}`,
  },
} as const;

export function getV4Addresses(chainId: number) {
  if (chainId === 1) return V4_ADDRESSES.mainnet;
  if (chainId === 11155111) return V4_ADDRESSES.sepolia;
  throw new Error(`Uniswap v4 not deployed on chain ${chainId}`);
}

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import type { Chain } from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo';

const chainId = process.env.NEXT_PUBLIC_CHAIN_ID || '11155111';
const selectedChains: readonly [Chain, ...Chain[]] = chainId === '1' ? [mainnet] : [sepolia];

export const config = getDefaultConfig({
  appName: 'ONETIME',
  projectId,
  chains: selectedChains,
  ssr: true,
});

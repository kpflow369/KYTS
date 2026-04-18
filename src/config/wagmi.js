import { http, createConfig } from 'wagmi';
import { mainnet, polygon, base, arbitrum } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Get a free projectId at https://cloud.walletconnect.com
const WALLETCONNECT_PROJECT_ID = 'YOUR_WALLETCONNECT_PROJECT_ID';

export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, base, arbitrum],
  connectors: [
    injected(), // MetaMask, Rabby, Brave Wallet, etc.
    walletConnect({
      projectId: WALLETCONNECT_PROJECT_ID,
      metadata: {
        name: 'ChainBite',
        description: 'Decentralized Food Delivery',
        url: 'http://localhost:8081',
        icons: ['https://avatars.githubusercontent.com/u/37784886'],
      },
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
  },
});

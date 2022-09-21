import WalletConnect from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

// const { INFURA_API_KEY } = process.env;

export const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK,
    options: {
      appName: 'SDK Demo',
      infuraId: '6540eba42f8d40f19a1f35a1ec4dcfe1',
    },
  },
  walletconnect: {
    package: WalletConnect,
    options: {
      infuraId: '6540eba42f8d40f19a1f35a1ec4dcfe1',
    },
  },
};

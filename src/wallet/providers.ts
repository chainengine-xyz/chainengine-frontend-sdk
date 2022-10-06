import WalletConnect from '@walletconnect/web3-provider';

const { INFURA_API_KEY } = process.env;

export const providers = (appName = 'ChainEngine') => {
  const infuraId = INFURA_API_KEY;

  return {
    // walletlink: {
    //   package: CoinbaseWalletSDK,
    //   options: {
    //     appName,
    //     infuraId,
    //   },
    // },
    // torus: {
    //   package: Torus,
    // },
    walletconnect: {
      package: WalletConnect,
      options: {
        appName,
        infuraId,
      },
    },
  };
};

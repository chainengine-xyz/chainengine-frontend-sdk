import WalletConnect from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import Torus from '@toruslabs/torus-embed';

// const { INFURA_API_KEY } = process.env;

export const providers = async () => {
  const infuraId = 'f175cea81dbf4bbf9fe3a16f4030de04';
  const appName = 'ChainEngine';
  const provider = new WalletConnect({
    infuraId,
  });
  await provider.disconnect();

  return {
    walletlink: {
      package: CoinbaseWalletSDK,
      options: {
        appName,
        infuraId,
      },
    },
    // coinbasewallet: {
    //   package: CoinbaseWalletSDK,
    //   options: {
    //     appName,
    //     infuraId,
    //   },
    // },
    torus: {
      package: Torus,
      // options: {
      //   networkParams: {
      //     chainId: 1337, // optional
      //     networkId: 1337, // optional
      //   },
      // },
    },
    walletconnect: {
      package: WalletConnect,
      options: {
        appName,
        infuraId,
      },
    },
  };
};

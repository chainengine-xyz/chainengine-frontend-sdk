// eslint-disable-next-line import/named
import { OAuthExtension } from '@magic-ext/oauth';
import { InstanceWithExtensions, SDKBase } from '@magic-sdk/provider';
import { ethers } from 'ethers';
import { Magic, MagicUserMetadata } from 'magic-sdk';

import { AuthContext } from '../AuthContext';
import { ApiMode } from '../chainengine.sdk';
import { ConfigContext } from '../config/ConfigContext';
import { SignedTransactionDataResponseDto } from '../nft';
import { INetwork } from '../types/INetworks';
import Deferred from '../utils/deferred';
import { IWalletInfo, NoncustodialProviders } from './types';

const MAGIC_LINK_API_KEY = 'pk_live_1534D203F16FD961';

export class WalletService {
  private magic: InstanceWithExtensions<SDKBase, OAuthExtension[]>;
  private readonly redirectURI: string;

  private provider: ethers.providers.Web3Provider;

  constructor() {
    const network =
      ConfigContext.getApiMode() === ApiMode.PROD
        ? ConfigContext.NETWORKS.matic
        : ConfigContext.NETWORKS.maticmum;

    this.magic = new Magic(MAGIC_LINK_API_KEY as string, {
      locale: 'en_US',
      network: {
        rpcUrl: network.providerUrl,
        chainId: network.chainId,
      },
      extensions: [new OAuthExtension()],
    });

    this.redirectURI = this.redirectURIBuilder();
  }

  async connectMetamaskWallet(): Promise<IWalletInfo> {
    try {
      const apiMode = ConfigContext.getApiMode();
      const network =
        apiMode === ApiMode.PROD
          ? ConfigContext.NETWORKS.matic
          : ConfigContext.NETWORKS.maticmum;

      if (!(window as any).ethereum) {
        throw new Error('Metamask is not available');
      }

      const pendingProvider: ethers.providers.Web3Provider =
        new ethers.providers.Web3Provider((window as any).ethereum);

      const chainId = await pendingProvider.send('eth_chainId', []);

      if (chainId !== Number(network.chainId).toString(16)) {
        await pendingProvider.send('wallet_switchEthereumChain', [
          { chainId: '0x' + Number(network.chainId).toString(16) },
        ]);
      }

      await pendingProvider.send('eth_requestAccounts', []);
      this.provider = pendingProvider;

      // No extra information for wallet infor for Metamask provider
      return {};
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async connectMagicLinkWallet(
    selectedProvider: NoncustodialProviders
  ): Promise<IWalletInfo> {
    // Using deferred as magic.loginWithRedirct resolves before redirecting.
    // That way we can be sure that the execution is not going beyond until redirect
    const deferred = new Deferred<IWalletInfo>();

    // We're using a storage control flag to check the pending oath redirect
    if (AuthContext.getPendingAuth() === selectedProvider) {
      await this.magic.oauth
        .getRedirectResult()
        .then(async () => {
          this.provider = new ethers.providers.Web3Provider(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.magic.rpcProvider as any
          );
          const meta: MagicUserMetadata = await this.magic.user.getMetadata();
          deferred.resolve({
            email: meta.email,
            phoneNumber: meta.phoneNumber,
          });
        })
        .catch((e) => {
          console.error('Error while authenticating');
          deferred.reject(e);
        })
        .finally(() => {
          AuthContext.removePendingAuth();
        });
    } else if (selectedProvider === AuthContext.getPlayer()?.authProvider) {
      this.provider = new ethers.providers.Web3Provider(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.magic.rpcProvider as any
      );

      const meta: MagicUserMetadata = await this.magic.user.getMetadata();
      deferred.resolve({
        email: meta.email,
        phoneNumber: meta.phoneNumber,
      });
    } else {
      AuthContext.setPendingAuth(selectedProvider);
      await this.magic.oauth
        .loginWithRedirect({
          redirectURI: this.redirectURI,
          provider: selectedProvider,
        })
        .catch(() => {
          AuthContext.removePendingAuth;
        });
    }

    return deferred.promise;
  }

  async personalSign(message: string): Promise<string> {
    const signer = this.provider.getSigner();

    const result = await signer.signMessage(message);

    return result;
  }

  async getAccount(): Promise<string> {
    const accounts = await this.provider.listAccounts();
    return accounts[0];
  }

  async getNetwork(): Promise<ethers.providers.Network | undefined> {
    try {
      const network = await this.provider.getNetwork();

      return network;
    } catch (err) {
      console.error(err);
    }
  }

  async signTypedData(
    transaction: SignedTransactionDataResponseDto
  ): Promise<string> {
    const signer = this.provider.getSigner();
    const { from: transactionFrom } = transaction;
    const from = await signer.getAddress();

    if (transactionFrom.toLowerCase() !== from?.toLowerCase()) {
      throw new Error(
        `The wallet address on the request is different from your wallet address`
      );
    }

    const { domain, types, message } = this.getTypedDataMessage(transaction);

    const result = await signer._signTypedData(domain, types, message);

    return result;
  }

  private getTypedDataMessage({
    domain,
    from,
    nft,
    value,
    gas,
    nonce,
    data,
  }: SignedTransactionDataResponseDto) {
    const types = {
      ForwardRequest: [
        { name: 'from', type: 'address' },
        { name: 'to', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'gas', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'data', type: 'bytes' },
      ],
    };

    const message = {
      from,
      to: nft.contractAddress,
      value,
      gas,
      nonce,
      data,
    };

    return {
      message,
      types,
      domain,
    };
  }

  private redirectURIBuilder(url = ''): string {
    const {
      location: { href },
    } = window;
    return `${href}${!href.endsWith('/') ? '/' : ''}${url}`;
  }

  getProvider(): ethers.providers.Web3Provider {
    return this.provider;
  }

  public changeMagiclinkNetwork(network: INetwork) {
    this.magic = new Magic(MAGIC_LINK_API_KEY as string, {
      locale: 'en_US',
      network: {
        rpcUrl: network.providerUrl,
        chainId: network.chainId,
      },
      extensions: [new OAuthExtension()],
    });
  }

  public requestMetamaskChangeNetwork(network: INetwork) {
    return this.provider
      .send('wallet_switchEthereumChain', [
        { chainId: '0x' + Number(network.chainId).toString(16) },
      ])
      .catch(async (error) => {
        if (error.code === 4902) {
          await this.provider.send('wallet_addEthereumChain', [
            {
              chainId: '0x' + Number(network.chainId).toString(16),
              chainName: 'Polygon Mumbai Testnet',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
            },
          ]);
        } else {
          throw error;
        }
      });
  }
}

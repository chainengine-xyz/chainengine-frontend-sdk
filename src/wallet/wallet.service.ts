// eslint-disable-next-line import/named
import { OAuthExtension } from '@magic-ext/oauth';
import { InstanceWithExtensions, SDKBase } from '@magic-sdk/provider';
import { ethers } from 'ethers';
import { Magic, MagicUserMetadata } from 'magic-sdk';
import Web3Modal from 'web3modal';

import { AuthContext } from '../AuthContext';
import { SignedTransactionDataResponseDto } from '../nft';
import Deferred from '../utils/deferred';
import { providers } from './providers';
import { IWalletInfo, NoncustodialProviders } from './types';

const { MAGIC_LINK_API_KEY } = process.env;

export class WalletService {
  private readonly magic: InstanceWithExtensions<SDKBase, OAuthExtension[]>;
  private readonly web3Modal: Web3Modal;
  private readonly redirectURI: string;

  private provider: ethers.providers.Web3Provider;

  constructor() {
    const providerOptions = providers();

    this.magic = new Magic(MAGIC_LINK_API_KEY as string, {
      locale: 'en_US',
      extensions: [new OAuthExtension()],
    });

    this.web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions,
    });

    this.redirectURI = this.redirectURIBuilder();
  }

  async connectMetamaskWallet(): Promise<IWalletInfo> {
    try {
      const pendingProvider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
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
}

// eslint-disable-next-line import/named
import { SDKBase, InstanceWithExtensions } from '@magic-sdk/provider';
import { OAuthExtension } from '@magic-ext/oauth';
import Web3Modal from 'web3modal';
import { Magic } from 'magic-sdk';
import { ethers } from 'ethers';

import { providers } from './providers';

const { MAGIC_LINK_API_KEY } = process.env;

enum OAuthProvider {
  FACEBOOK = 'facebook',
  DISCORD = 'discord',
  TWITTER = 'twitter',
  GOOGLE = 'google',
  TWITCH = 'twitch',
}

export class WalletService {
  private readonly magic: InstanceWithExtensions<SDKBase, OAuthExtension[]>;
  private readonly web3Modal: Web3Modal;
  private readonly redirectURI: string;

  private provider: ethers.providers.Web3Provider;

  constructor() {
    const providerOptions = providers();
    window?.localStorage?.clear?.();

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

  async connectNonCustodialWallet() {
    await this.redirectResult();

    if (this.provider) return;

    try {
      const instance = await this.web3Modal.connect();
      this.provider = new ethers.providers.Web3Provider(instance);
    } catch (err) {
      console.error(err);
    }
  }

  async connectCustodialWallet(provider: OAuthProvider) {
    await this.redirectResult();

    if (this.provider) return;

    try {
      await this.handleLoginWithRedirect(provider);
      this.provider = new ethers.providers.Web3Provider(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.magic.rpcProvider as any
      );
    } catch (err) {
      console.error(err);
    }
  }

  async personalSign(message: string): Promise<string> {
    const signer = this.provider.getSigner();

    const result = await signer.signMessage(message);

    return result;
  }

  async getAccount(): Promise<string | undefined> {
    try {
      const accounts = await this.provider.listAccounts();

      return accounts[0];
    } catch (err) {
      console.error(err);
    }
  }

  async getNetwork(): Promise<ethers.providers.Network | undefined> {
    try {
      const network = await this.provider.getNetwork();

      return network;
    } catch (err) {
      console.error(err);
    }
  }

  private async redirectResult() {
    if (!window.location.search) return;

    try {
      await this.magic.oauth.getRedirectResult();

      this.provider = new ethers.providers.Web3Provider(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.magic.rpcProvider as any
      );
    } catch (err) {
      console.error(err);
    }
  }

  private async handleLoginWithRedirect(
    provider: OAuthProvider
  ): Promise<void> {
    await this.magic.oauth.loginWithRedirect({
      redirectURI: this.redirectURI,
      provider,
    });
  }

  private redirectURIBuilder(url = ''): string {
    const {
      location: { href },
    } = window;
    return `${href}${!href.endsWith('/') ? '/' : ''}${url}`;
  }
}

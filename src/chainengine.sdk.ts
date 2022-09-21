import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

import { AuthService } from './auth/auth.service';
import { providers } from './utils/providers';

export enum ApiMode {
  PROD = 'mainnet',
  TEST = 'testnet',
}

export enum AuthProvider {
  CUSTODIAL = 'custodial',
  METAMASK = 'metamask',
  COINBASE = 'coinbase',
  WALLET_CONNECT = 'wallet-connect',
}

const walletMessageBuilder = (nonce: string, gameName: string): string =>
  `I'm signing my one-time nonce: ${nonce} to authenticate on the game ${gameName}.`;

export class ChainEngineSdk {
  private readonly authService: AuthService;
  private readonly gameId: string;

  private nonceToBeSigned: string;

  constructor(gameId: string) {
    this.gameId = gameId;

    this.authService = new AuthService();
  }

  async authPlayer(): Promise<boolean> {
    const providerOptions = await providers();
    await this.getNonce();

    const web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions,
    });

    // disconnect
    await web3Modal.clearCachedProvider();

    const instance = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(instance);
    const accounts = await provider.listAccounts();
    // const network = await provider.getNetwork();
    const signer = provider.getSigner();

    console.log(accounts[0]);

    const result = await signer.signMessage(
      walletMessageBuilder(this.nonceToBeSigned, 'test')
    );

    console.log(result);

    return false;
  }

  private async getNonce(): Promise<void> {
    if (this.nonceToBeSigned) return;

    const { nonce } = await this.authService.getNonce(this.gameId);

    this.nonceToBeSigned = nonce;
  }
}

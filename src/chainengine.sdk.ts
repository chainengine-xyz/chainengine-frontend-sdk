import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

import { AuthService } from './auth/auth.service';
import { providerOptions } from './utils/providers';

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
  }

  async authPlayer(): Promise<boolean> {
    await this.getNonce();

    const web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions,
    });

    const provider = await web3Modal.connect();
    const ethersProvider = new ethers.providers.Web3Provider(provider);
    const signer = ethersProvider.getSigner();

    const result = await signer.signMessage(walletMessageBuilder(this.nonceToBeSigned, 'test'));

    console.log(result);

    return false;
  }

  private async getNonce(): Promise<void> {
    if (this.nonceToBeSigned) return;

    const { nonce } = await this.authService.getNonce(this.gameId);

    this.nonceToBeSigned = nonce;
  }
}

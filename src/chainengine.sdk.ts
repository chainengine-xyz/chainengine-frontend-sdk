import { AuthService, NonceResponseDto } from './auth';
import { WalletService } from './wallet';
import { Token } from './utils/http';

export enum ApiMode {
  PROD = 'mainnet',
  TEST = 'testnet',
}

export enum AuthProvider {
  NONCUSTODIAL = 'noncustodial',
  // FACEBOOK = 'facebook',
  DISCORD = 'discord',
  // TWITTER = 'twitter',
  GOOGLE = 'google',
  TWITCH = 'twitch',
}

export class ChainEngineSdk {
  private readonly walletService: WalletService;
  private readonly authService: AuthService;
  private readonly projectId: string;

  private nonceData: NonceResponseDto;
  private token: Token;

  constructor(projectId: string) {
    this.projectId = projectId;

    this.walletService = new WalletService();
    this.authService = new AuthService();
  }

  async authPlayer(provider: AuthProvider): Promise<boolean> {
    if (!!this.token) return true;

    await this.getNonce();

    if (provider === AuthProvider.NONCUSTODIAL) {
      await this.walletService.connectNonCustodialWallet();
    } else {
      await this.walletService.connectCustodialWallet(provider as any);
    }

    const walletAddress = (await this.walletService.getAccount()) as string;

    const { message, nonce } = this.nonceData;

    const signature = await this.walletService.personalSign(message);

    const result = await this.authService.postAuth({
      walletAddress,
      signature,
      nonce,
    });

    if (result) {
      console.log({ walletAddress, signature });
      console.log({ token: result });

      this.token = result;

      return true;
    }

    return false;
  }

  private async getNonce(): Promise<void> {
    if (this.nonceData) return;

    try {
      this.nonceData = await this.authService.getNonce(this.projectId);
    } catch (err) {
      console.error(err);
    }
  }
}

import { AuthService, NonceResponseDto } from './auth';
import { WalletService } from './wallet';
import { NftResponseDto, NftService, SignedTransactionRequestDto } from './nft';
import { ApiMode, Token } from './utils';

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
  private nftService: NftService;

  private nonceData: NonceResponseDto;
  private isProdMode: boolean;
  private token?: Token;

  constructor(projectId: string) {
    this.projectId = projectId;
    this.isProdMode = false;

    this.walletService = new WalletService();
    this.authService = new AuthService();
    this.nftService = new NftService();
  }

  async UserAuthentication(provider: AuthProvider): Promise<boolean> {
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
      this.token = result;

      return true;
    }

    return false;
  }

  userLogout(): void {
    this.token = undefined;
  }

  get ApiMode(): ApiMode {
    return this.isProdMode ? ApiMode.PROD : ApiMode.TEST;
  }

  SetTestNetMode() {
    this.isProdMode = false;
    this.switchApiMode();
  }

  SetMainNetMode() {
    this.isProdMode = true;
    this.switchApiMode();
  }

  async GetUserNft(nftId: string): Promise<NftResponseDto | undefined> {
    try {
      if (!this.token) throw new Error('User is not authenticated');

      return this.nftService.getById(nftId, this.token);
    } catch (err) {
      console.error(err);
    }
  }

  async TransferNft(data: SignedTransactionRequestDto) {
    try {
      if (!this.token) throw new Error('User is not authenticated');

      const transfer = await this.nftService.transfer(data, this.token);

      const signature = await this.walletService.signTypedData(transfer);

      await this.nftService.signTransfer(transfer.id, signature, this.token);
    } catch (err) {
      console.error(err);
    }
  }

  private async getNonce(): Promise<void> {
    if (this.nonceData) return;

    try {
      this.nonceData = await this.authService.getNonce(this.projectId);
    } catch (err) {
      console.error(err);
    }
  }

  private switchApiMode() {
    this.nftService = new NftService(this.ApiMode);
  }
}

import { AuthService, NonceResponseDto } from '../auth';
import { AuthContext } from '../AuthContext';
import { Token } from '../utils';
import Deferred from '../utils/deferred';
import { renderSelectProviderModal } from './selectProviderModal';
import {
  AvailableAuthProviders,
  CustodianProviders,
  IPlayer,
  NoncustodialProviders,
} from './types';
import { WalletService } from './wallet.service';

export class Wallet {
  private readonly projectId: string;
  private readonly authService: AuthService;
  private readonly walletService: WalletService;

  constructor(
    projectId: string,
    authService: AuthService,
    walletService: WalletService
  ) {
    this.projectId = projectId;
    this.authService = authService;
    this.walletService = walletService;
  }

  public async connect(
    selectedProvider?: AvailableAuthProviders
  ): Promise<void> {
    const cachedProvider = AuthContext.getPlayer()?.authProvider;
    const pendingAuthProvider = AuthContext.getPendingAuth();

    let provider: AvailableAuthProviders =
      selectedProvider ?? pendingAuthProvider ?? cachedProvider;

    if (!provider) {
      provider = await renderSelectProviderModal();
    }

    let walletInfo;
    if (provider === CustodianProviders.METAMASK) {
      walletInfo = await this.walletService.connectMetamaskWallet();
    } else {
      walletInfo = await this.walletService.connectMagicLinkWallet(provider);
    }

    // We assume that if a player is available (with token) AND there was a cached provider,
    // user is already authenticated on API
    // ... No need to go on the rest of the steps
    if (AuthContext.getPlayer() && cachedProvider) {
      return;
    }

    const walletAddress = await this.walletService.getAccount();
    const nonceData = await this.getNonce();
    const signature = await this.walletService.personalSign(nonceData.message);

    const decodedChainengineToken: Token = await this.authService.postAuth({
      walletAddress,
      signature,
      nonce: nonceData.nonce,
    });

    if (decodedChainengineToken) {
      const player: IPlayer = {
        playerId: decodedChainengineToken.sub,
        walletAddress: decodedChainengineToken.walletAddress,
        token: decodedChainengineToken,
        authProvider: provider,
        ...walletInfo,
      };
      AuthContext.setPlayer(player);
    } else {
      AuthContext.clean();
      throw new Error('Error while authenticating');
    }
  }

  public getInfo() {
    return AuthContext.getPlayer();
  }

  public getBalance() {
    throw new Error('To be implemented');
  }

  public signMessage() {
    throw new Error('To be implemented');
  }

  private async getNonce(): Promise<NonceResponseDto> {
    return this.authService.getNonce(this.projectId);
  }
}

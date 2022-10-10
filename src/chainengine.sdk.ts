import { AuthService } from './auth';
import { AuthContext } from './AuthContext';
import { ConfigContext } from './config/ConfigContext';
import { Marketplace } from './marketplace';
import { MarketplaceService } from './marketplace/marketplace.service';
import { NFT, NftService } from './nft';
import { WalletService } from './wallet';
import { CustodianProviders, NoncustodialProviders } from './wallet/types';
import { Wallet } from './wallet/wallet';

export const AuthProviders = {
  Noncustodial: NoncustodialProviders,
  Custodian: CustodianProviders,
};

export enum ApiMode {
  PROD = 'mainnet',
  TEST = 'testnet',
}

export class ChainEngineSdk {
  public readonly nft: NFT;
  public readonly wallet: Wallet;
  public readonly marketplace: Marketplace;

  constructor(projectId: string, apiMode: ApiMode = ApiMode.TEST) {
    ConfigContext.setApiMode(apiMode);

    const walletService = new WalletService();
    const authService = new AuthService();
    const nftService = new NftService();
    const marketplaceService = new MarketplaceService();

    this.nft = new NFT(projectId, nftService, walletService);
    this.wallet = new Wallet(projectId, authService, walletService);
    this.marketplace = new Marketplace(
      projectId,
      marketplaceService,
      walletService
    );
  }

  public isAuthenticatedOrPending() {
    return !!AuthContext.getPlayer() || !!AuthContext.getPendingAuth();
  }
}

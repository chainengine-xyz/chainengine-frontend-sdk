import { WalletService } from '../wallet';
import { MarketplaceService } from './marketplace.service';

export class Marketplace {
  private readonly projectId: string;
  private readonly marketplaceService: MarketplaceService;
  private readonly walletService: WalletService;

  constructor(
    projectId: string,
    marketplaceService: MarketplaceService,
    walletService: WalletService
  ) {
    this.projectId = projectId;
    this.marketplaceService = marketplaceService;
    this.walletService = walletService;
  }

  public getListings() {
    return this.marketplaceService.getListings(this.projectId);
  }

  public getListing(listingId: string) {
    return this.marketplaceService.getListing(listingId);
  }

  // public getMyListings() {
  //   throw new Error('To be implementedd');
  // }

  public async buy(listingId: string) {
    const listing = await this.getListing(listingId);

    const provider = this.walletService.getProvider();

    return this.marketplaceService.buy(listing.protocolOffer, provider);
  }

  // public createListing(listingId: string, amount: number) {
  //   throw new Error('To be implementedd');
  // }

  // public cancelListing(listingId: string, amount: number) {
  //   throw new Error('To be implemented');
  // }
}

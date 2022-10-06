import { MarketplaceService } from './marketplace.service';

export class Marketplace {
  private readonly projectId: string;
  private readonly marketplaceService: MarketplaceService;

  constructor(projectId: string, marketplaceService: MarketplaceService) {
    this.projectId = projectId;
    this.marketplaceService = marketplaceService;
  }

  public getListings() {
    return this.marketplaceService.getListings(this.projectId);
  }

  public getMyListings() {
    throw new Error('To be implementedd');
  }
  public buy(listingId: string, amount: number) {
    throw new Error('To be implementedd');
  }

  public createListing(listingId: string, amount: number) {
    throw new Error('To be implementedd');
  }

  public cancelListing(listingId: string, amount: number) {
    throw new Error('To be implemented');
  }
}

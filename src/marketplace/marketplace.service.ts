import { ConfigContext } from '../ConfigContext';
import { apiRequest } from '../utils';
import { ListingResponseDto } from './marketplace.dto';

export class MarketplaceService {
  public getListings(gameId: string) {
    return apiRequest<ListingResponseDto[]>({
      url: `/marketplace/listings/?gameId=${gameId}`,
      apiMode: ConfigContext.getApiMode(),
    });
  }
}

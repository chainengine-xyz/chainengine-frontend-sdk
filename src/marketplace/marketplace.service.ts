import { Seaport } from '@opensea/seaport-js';
import { OrderWithCounter } from '@opensea/seaport-js/lib/types';
import { ContractTransaction, ethers } from 'ethers';
import { ConfigContext } from '../config/ConfigContext';
import { apiRequest } from '../utils';
import { ListingResponseDto } from './marketplace.dto';

export class MarketplaceService {
  public async buy(
    order: OrderWithCounter,
    provider: ethers.providers.Web3Provider
  ): Promise<ContractTransaction> {
    /*
     * This step shouold create a new message to be signed by the user.
     *
     * If the user is using metamask we build the Seaport object on the confirmation page.
     */
    const seaport = new Seaport(provider);

    const { executeAllActions } = await seaport.fulfillOrder({
      order: order,
      unitsToFill: 1,
    });

    return executeAllActions();
  }

  public getListings(gameId: string) {
    return apiRequest<ListingResponseDto[]>({
      url: `/marketplace/listings/?gameId=${gameId}`,
      apiMode: ConfigContext.getApiMode(),
    });
  }

  public getListing(listingId: string) {
    return apiRequest<ListingResponseDto>({
      url: `/marketplace/listings/${listingId}`,
      apiMode: ConfigContext.getApiMode(),
    });
  }
}

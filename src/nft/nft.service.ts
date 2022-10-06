import { AuthContext } from '../AuthContext';
import { ConfigContext } from '../ConfigContext';
import { apiRequest } from '../utils';
import {
  NftResponseDto,
  SignedTransactionDataResponseDto,
  SignedTransactionRequestDto,
} from './nft.dto';

export class NftService {
  getById(nftId: string): Promise<NftResponseDto> {
    return apiRequest<NftResponseDto>({
      url: `/clientapp/players/nfts/${nftId}`,
      apiMode: ConfigContext.getApiMode(),
      token: AuthContext.getToken(),
    });
  }

  getAll(gameId: string): Promise<NftResponseDto> {
    return apiRequest<NftResponseDto>({
      url: `/clientapp/players/nfts/?queryBy=game&id=${gameId}`,
      apiMode: ConfigContext.getApiMode(),
      token: AuthContext.getToken(),
    });
  }

  transfer(
    data: SignedTransactionRequestDto
  ): Promise<SignedTransactionDataResponseDto> {
    return apiRequest<SignedTransactionDataResponseDto>({
      url: '/clientapp/players/nfts/transfer',
      apiMode: ConfigContext.getApiMode(),
      token: AuthContext.getToken(),
      config: {
        method: 'POST',
        body: JSON.stringify(data),
      },
    });
  }

  signTransfer(id: string, signature: string): Promise<void> {
    return apiRequest({
      url: `/clientapp/players/nfts/transfer/${id}`,
      apiMode: ConfigContext.getApiMode(),
      token: AuthContext.getToken(),
      config: {
        method: 'POST',
        body: JSON.stringify({ signature }),
      },
    });
  }
}

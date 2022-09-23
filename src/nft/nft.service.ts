import { ApiMode, apiRequest, Token } from '../utils';
import {
  SignedTransactionDataResponseDto,
  SignedTransactionRequestDto,
  NftResponseDto,
} from './nft.dto';

export class NftService {
  constructor(private apiMode = ApiMode.TEST) {}

  getById(nftId: string, token: Token): Promise<NftResponseDto> {
    return apiRequest<NftResponseDto>({
      url: `/clientapp/players/nfts/${nftId}`,
      apiMode: this.apiMode,
      token,
    });
  }

  transfer(
    data: SignedTransactionRequestDto,
    token: Token
  ): Promise<SignedTransactionDataResponseDto> {
    return apiRequest<SignedTransactionDataResponseDto>({
      url: '/clientapp/players/nfts/transfer',
      apiMode: this.apiMode,
      token,
      config: {
        method: 'POST',
        body: JSON.stringify(data),
      },
    });
  }

  signTransfer(id: string, signature: string, token: Token): Promise<void> {
    return apiRequest({
      url: `/clientapp/players/nfts/transfer/${id}`,
      apiMode: this.apiMode,
      token,
      config: {
        method: 'POST',
        body: JSON.stringify({ signature }),
      },
    });
  }
}

import { INftMetadata, NftStatus } from '../nft';

export class ListingResponseDto {
  id: string;
  nftId: string;
  price: number;
  amount: number;
  receiptWallet: string;
  protocolOffer: any;
  status: string;
  nft: {
    id: string;
    chain: string;
    gameId: string;
    status: NftStatus;
    onChainId: string;
    accountId: string;
    metadata: INftMetadata;
    transactionHash: string;
    mintingErrorMsg: string;
    contractAddress: string;
    holders: Map<string, number>;
    supply: number;
    supplyAvailable: number;
    createdAt: Date;
  };
}

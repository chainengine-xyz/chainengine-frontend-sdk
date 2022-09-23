export enum NftStatus {
  CREATING = 'CREATING',
  ONCHAIN = 'ONCHAIN',
  FAILED = 'FAILED',
}

export interface ITypedDataDomain {
  name?: string;
  version?: string;
  chainId?: number;
  verifyingContract?: string;
  salt?: string;
}

export interface INftMetadata {
  description: string;
  image: string;
  name: string;
  URI: string;
  attributes: object;
}

export class NftResponseDto {
  id: string;
  contractAddress: string;
  onChainId: string;
  chain: string;
  accountId: string;
  gameId: string;
  status: NftStatus;
  mintingErrorMsg: string;
  metadata: INftMetadata;
  transactionHash: string;
  holders: Map<string, number>;
  supply: number;
  supplyAvailable: number;
  createdAt: Date;
}

export class SignedTransactionRequestDto {
  walletAddress: string;
  nftId: string;
  amount: number;
}

export class SignedTransactionDataResponseDto {
  id: string;
  nft: {
    contractAddress: string;
    description: string;
    onChainId: string;
    image: string;
    name: string;
  };
  amount: number;
  from: string;
  to: string;
  domain: ITypedDataDomain;
  nonce: number;
  value: string;
  data: string;
  gas: string;
  isSigned: boolean;
}

export class TransferSignatureRequestDto {
  signature: string;
}

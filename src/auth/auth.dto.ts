export interface IOAuthUserMetadata {
  publicAddress?: string;
  phoneNumber?: string;
  issuer?: string;
  email?: string;
}

export class NonceRequestDto {
  gameId: string;
}

export class NonceResponseDto {
  nonce: string;
}

export declare class NonCustodialAuthRequestDto {
  walletAddress: string;
  signature: string;
  nonce: string;
}

export declare class CustodialAuthRequestDto {
  userMetadata: IOAuthUserMetadata;
  idToken: string;
  nonce: string;
}

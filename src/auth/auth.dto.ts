export interface IGameData {
  id: string;
  name: string;
  description?: string;
  image?: string;
}
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
  message: string;
  game: IGameData;
  nonceSigned: boolean;
}

export declare class AuthRequestDto {
  walletAddress: string;
  signature: string;
  nonce: string;
}

export class AuthResponseDto {
  token?: string;
  error?: string;
}

import { Token } from '../utils';

export enum CustodianProviders {
  METAMASK = 'metamask',
  // // FACEBOOK = 'facebook',
  // DISCORD = 'discord',
  // // TWITTER = 'twitter',
  // GOOGLE = 'google',
  // TWITCH = 'twitch',
}

export enum NoncustodialProviders {
  // FACEBOOK = 'facebook',
  // DISCORD = 'discord',
  // TWITTER = 'twitter',
  GOOGLE = 'google',
  // TWITCH = 'twitch',
}

export interface IWalletInfo {
  email?: string | null;
  phoneNumber?: string | null;
}

export interface IPlayer extends IWalletInfo {
  playerId: string;
  walletAddress: string;
  token: Token;
  authProvider: AvailableAuthProviders;
}

export type AvailableAuthProviders = CustodianProviders | NoncustodialProviders;

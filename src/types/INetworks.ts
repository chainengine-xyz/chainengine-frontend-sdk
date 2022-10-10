import { TAvailableNetworks } from '../config/ConfigContext';

export type INetwork = {
  key: TAvailableNetworks;
  aliases: string;
  providerUrl: string;
  chainId: number;
  isTest: boolean;
};

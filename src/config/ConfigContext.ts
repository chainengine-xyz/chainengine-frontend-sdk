import { ApiMode } from '../chainengine.sdk';
import { INetwork } from '../types/INetworks';
import { LocalStorage } from '../utils/localStorage';

// Availables
export type TAvailableNetworks = 'matic' | 'maticmum';
export type TAvailableCurrencies = 'USDC' | 'matic';
export type TAvailableSigninMethods = 'Metamask' | 'Google';

export abstract class ConfigContext {
  static readonly NETWORKS: Record<TAvailableNetworks, INetwork> = {
    matic: {
      key: 'matic',
      aliases: 'Polygon',
      providerUrl: process.env.MATIC_PROVIDER_URL!,
      chainId: 137,
      isTest: false,
    },
    maticmum: {
      key: 'maticmum',
      aliases: 'Mumbai',
      providerUrl: process.env.MATICMUM_PROVIDER_URL!,
      chainId: 80001,
      isTest: true,
    },
  };

  public static getApiMode(): ApiMode {
    return LocalStorage.getValue('API_MODE', ApiMode.TEST);
  }

  public static setApiMode(apiMode: ApiMode) {
    LocalStorage.setValue('API_MODE', apiMode);
  }
}

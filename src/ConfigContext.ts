import { ApiMode } from './utils';
import { LocalStorage } from './utils/localStorage';

export abstract class ConfigContext {
  public static getApiMode(): ApiMode {
    return LocalStorage.getValue('API_MODE', ApiMode.TEST);
  }

  public static setApiMode(apiMode: ApiMode) {
    LocalStorage.setValue('API_MODE', apiMode);
  }
}

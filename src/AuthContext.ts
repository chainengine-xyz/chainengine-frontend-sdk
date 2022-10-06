import { Token } from './utils';
import { LocalStorage } from './utils/localStorage';
import { IPlayer, NoncustodialProviders } from './wallet/types';

export abstract class AuthContext {
  public static getToken(): Token {
    return AuthContext.getPlayer().token;
  }
  public static setPlayer(player: IPlayer) {
    LocalStorage.setValue('CHAIN_ENGINE_PLAYER', player);
  }

  public static getPlayer(): IPlayer {
    const playerStringObject = LocalStorage.getValue('CHAIN_ENGINE_PLAYER');

    try {
      const player = JSON.parse(playerStringObject);
      return player;
    } catch {
      throw new Error('Invalid json object for key CHAIN_ENGINE_PLAYER');
    }
  }

  public static removePlayer() {
    LocalStorage.removeValue('CHAIN_ENGINE_PLAYER');
  }

  public static isAuthenticated(): boolean {
    return !!AuthContext.getPlayer();
  }

  public static setPendingAuth(authProvider: NoncustodialProviders) {
    LocalStorage.setValue('CHAIN_ENGINE_OAUTH_PENDING', authProvider);
  }

  public static getPendingAuth(): NoncustodialProviders {
    return LocalStorage.getValue('CHAIN_ENGINE_OAUTH_PENDING');
  }

  public static removePendingAuth() {
    LocalStorage.removeValue('CHAIN_ENGINE_OAUTH_PENDING');
  }

  public static clean() {
    LocalStorage.removeValue('CHAIN_ENGINE_PLAYER');
    LocalStorage.removeValue('CHAIN_ENGINE_OAUTH_PENDING');
  }
}

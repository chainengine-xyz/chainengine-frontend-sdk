import { v4 as uuid } from 'uuid';

import { AuthService } from './auth.service';
import * as http from '../utils/http';

describe('AuthService', () => {
  const service: AuthService = new AuthService();

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getNonce', () => {
    it('should return nonce', async () => {
      const nonce = uuid();

      jest.spyOn(http, 'apiRequest').mockImplementation(() =>
        Promise.resolve({
          nonce,
        })
      );

      expect(await service.getNonce('123')).toStrictEqual({ nonce });
    });
  });
});

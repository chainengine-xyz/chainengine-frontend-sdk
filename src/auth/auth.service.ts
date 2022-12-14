import jwt from 'jsonwebtoken';

import { NonceResponseDto, AuthRequestDto, AuthResponseDto } from './auth.dto';
import { apiRequest, Token } from '../utils';

export class AuthService {
  getNonce(gameId: string): Promise<NonceResponseDto> {
    return apiRequest<NonceResponseDto>({
      url: '/clientapp/auth/nonce',
      config: {
        method: 'POST',
        body: JSON.stringify({ gameId }),
      },
    });
  }

  async postAuth(data: AuthRequestDto): Promise<Token> {
    const { token, error } = await apiRequest<AuthResponseDto>({
      url: '/clientapp/auth',
      config: {
        method: 'POST',
        body: JSON.stringify(data),
      },
    });

    if (!token) throw new Error(`Invalid token`);
    if (error) throw new Error(error);

    const result = jwt.decode(token) as Omit<Token, 'jwt'>;

    return {
      ...result,
      jwt: token,
    };
  }
}

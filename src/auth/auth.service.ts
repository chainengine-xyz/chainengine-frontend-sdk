import { NonceResponseDto, NonCustodialAuthRequestDto, CustodialAuthRequestDto } from './auth.dto';
import { apiRequest, Token } from '../utils/http';

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

  postNonCustodialAuth(data: NonCustodialAuthRequestDto): Promise<Token> {
    return apiRequest({
      url: '/clientapp/auth',
      config: {
        method: 'POST',
        body: JSON.stringify(data),
      },
    });
  }

  postCustodialAuth(data: CustodialAuthRequestDto): Promise<Token> {
    return apiRequest({
      url: '/clientapp/auth/oauth',
      config: {
        method: 'POST',
        body: JSON.stringify(data),
      },
    });
  }
}

export interface FetchRequest {
  url: string;
  config?: RequestInit;
  apiMode?: ApiMode;
  token?: Token;
}

export interface Token {
  walletAddress: string;
  sub: string;
  iat: number;
  exp: number;
  jwt: string;
}

export enum ApiMode {
  PROD = 'mainnet',
  TEST = 'testnet',
}

export class APIError extends Error {
  code?: number;

  constructor({ message, code }: { message?: string; code?: number }) {
    super(message);
    this.code = code;
  }
}

export function apiUrl(path: string): string {
  return (process?.env?.API_URL ?? 'http://localhost:3000') + path;
}

export async function request<T>({
  url,
  token,
  config,
  apiMode,
}: FetchRequest): Promise<T> {
  const headers = new Headers(config?.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token.jwt}`);
  }

  if (apiMode) {
    headers.set('api-mode', apiMode);
  }

  const resp = await fetch(apiUrl(url), {
    ...config,
    headers,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let json = {} as any;

  try {
    json = await resp.json();
  } catch {
    // it's okay response is not json
  }

  if (!resp.ok) {
    throw new APIError({
      message: json?.message ?? json?.error,
      code: json?.status,
    });
  }

  return json;
}

export async function jsonRequest<T>(fetchRequest: FetchRequest): Promise<T> {
  const headers = new Headers(fetchRequest.config?.headers);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const config = { ...fetchRequest.config, headers };
  return request<T>({ ...fetchRequest, config });
}

export async function apiRequest<T>({
  url,
  token,
  config,
  apiMode,
}: FetchRequest): Promise<T> {
  return jsonRequest<T>({ url, token, config, apiMode });
}

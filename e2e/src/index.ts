import { ChainEngineSdk, AuthProvider } from 'chainengine-sdk-front';

const sdk = new ChainEngineSdk('1d07d1b4-ce89-43e4-80c6-4d9649cfb337');
sdk.authPlayer(AuthProvider.GOOGLE);

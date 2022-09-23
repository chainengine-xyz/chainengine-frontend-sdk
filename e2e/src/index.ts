import { ChainEngineSdk, AuthProvider } from '@chainengine-sdk/front-end';

(async () => {
  const sdk = new ChainEngineSdk('1d07d1b4-ce89-43e4-80c6-4d9649cfb337');

  await sdk.UserAuthentication(AuthProvider.NONCUSTODIAL);

  console.log(await sdk.GetUserNft('c894fcaa-b7e4-4ee0-bf45-9980d3e358d2'));

  await sdk.TransferNft({
    walletAddress: '0x4a3af7e98d914628fbbd56aa86d350683d0228c5',
    nftId: 'c894fcaa-b7e4-4ee0-bf45-9980d3e358d2',
    amount: 1,
  });
})();

import { ChainEngineSdk, ApiMode } from 'chainengine-frontend-sdk';

const sdk = new ChainEngineSdk(
  '9b45ddac-1714-4af6-addf-4406e2bb054c',
  ApiMode.TEST
);

(async () => {
  if (sdk.isAuthenticatedOrPending()) {
    sdk.wallet.connect();
  }

  // WALLET
  const resultWallet = document.getElementById('resultWallet');
  const connectButton = document.getElementById('connectButton');
  const isUserAuthenticated = document.getElementById('isUserAuthenticated');
  const currentApiMode = document.getElementById('currentApiMode');

  // const toggleApiMode = document.getElementById('toggleApiMode');

  const logoutButton = document.getElementById('logout');

  const getWalletInfoButton = document.getElementById('walletInfo');

  connectButton!.onclick = async () => {
    sdk.wallet
      .connect()
      .then((res) => {
        resultWallet!.innerHTML = String(res);
      })
      .catch((e) => {
        resultWallet!.innerHTML = 'error';
        throw e;
      });
  };

  getWalletInfoButton!.onclick = async () => {
    resultWallet!.innerHTML = JSON.stringify(sdk.wallet.getInfo());
  };

  isUserAuthenticated!.onclick = async () => {
    resultWallet!.innerHTML = String(sdk.isAuthenticatedOrPending());
  };

  currentApiMode!.onclick = async () => {
    resultWallet!.innerHTML = String(sdk.wallet.getApiMode());
  };

  // toggleApiMode!.onclick = async () => {
  //   resultWallet!.innerHTML = 'Loading...';
  //   sdk.wallet
  //     .toggleApiMode()
  //     .then(() => {
  //       resultWallet!.innerHTML = 'Success!';
  //     })
  //     .catch(() => {
  //       resultWallet!.innerHTML = 'Error';
  //     });
  // };

  currentApiMode!.onclick = async () => {
    resultWallet!.innerHTML = String(sdk.wallet.getApiMode());
  };

  logoutButton!.onclick = async () => {
    sdk.wallet.logout();
  };

  // NFT
  const resultNft = document.getElementById('resultNft');
  const getSingleNftButton = document.getElementById('getSingleNftButton');
  const getAllNftsButton = document.getElementById('getAllNftsButton');
  const nftIdGetSingleNft = <HTMLInputElement>(
    document.getElementById('nftIdGetSingleNft')
  );

  const transferNftButton = document.getElementById('transferNftButton');
  const nftIdTransferNft = <HTMLInputElement>(
    document.getElementById('nftIdTransferNft')
  );
  const destinationAddressTransferNft = <HTMLInputElement>(
    document.getElementById('destinationAddressTransferNft')
  );
  const amountTransferNft = <HTMLInputElement>(
    document.getElementById('amountTransferNft')
  );

  getSingleNftButton!.onclick = async () => {
    sdk.nft
      .getById(nftIdGetSingleNft!.value)
      .then((res) => {
        resultNft!.innerHTML = JSON.stringify(res);
      })
      .catch((e) => {
        resultNft!.innerHTML = 'error';
        throw e;
      });
  };

  getAllNftsButton!.onclick = async () => {
    sdk.nft
      .getAll()
      .then((res) => {
        resultNft!.innerHTML = JSON.stringify(res);
      })
      .catch((e) => {
        resultNft!.innerHTML = 'error';
        throw e;
      });
  };

  transferNftButton!.onclick = async () => {
    sdk.nft
      .transfer({
        nftId: nftIdTransferNft!.value,
        walletAddress: destinationAddressTransferNft!.value,
        amount: Number(amountTransferNft!.value),
      })
      .then((res) => {
        resultNft!.innerHTML = JSON.stringify(res);
      })
      .catch((e) => {
        resultNft!.innerHTML = 'error';
        throw e;
      });
  };

  // Marketplace
  const resultMarketplace = document.getElementById('resultMarketplace');
  const getListingsButton = document.getElementById('getListingsButton');

  getListingsButton!.onclick = async () => {
    sdk.marketplace
      .getListings()
      .then((res) => (resultMarketplace!.innerHTML = JSON.stringify(res)));
  };

  const listingIdBuyButton = document.getElementById('listingIdBuyButton');
  const listingIdBuyInput = <HTMLInputElement>(
    document.getElementById('listingIdBuyInput')
  );
  listingIdBuyButton!.onclick = async () => {
    sdk.marketplace
      .buy(listingIdBuyInput!.value)
      .then((res) => (resultMarketplace!.innerHTML = JSON.stringify(res)));
  };
})();

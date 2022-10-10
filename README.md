# ChainEngine

ChainEngine is the simplest blockchain integration platform for a game
developer. We provide SDKs, API, and no-code tools to make it easy for a game
developer to start building NFT-based games.

To learn more about ChainEngine, please read our
[Overview](https://docs.chainengine.xyz/docs/overview) or jump right into
[Quick Start](https://docs.chainengine.xyz/docs/getting-started)

# Chainengine Frontend SDK

## Install and Setup

To install Chainengine Frotend SDK to your project:

### NPM

```shell
npm install --save chainengine-frontend-sdk
```

### YARN

```shell
yarn add chainengine-frontend-sdk
```

## Configuration

To use Chainengine Frontend SDK the only parameter you need to provide is the
Game ID

```javascript
import { ChainEngineSdk } from 'chainengine-frontend-sdk';

sdk = new ChainEngineSdk(YOUR_PROJECT_ID);
```

### Connect

In order to authenticate user, `sdk.wallet.connect` must be called. Uppon the
first call, our _Provider Selector Modal_ is displayed so the Player can select
how he wants to authenticate.

`sdk.wallet.connect` **MUST** be called everytime your page is reloaded, but you
probable want to display the Provider _Selector Modal_ only after an user
interaction, like when the user clicks on Login button.

In order to call `sdk.wallet.connect()` only when the user is already
authenticated, you can use `sdk.isAuthenticatedOrPending()`:

```javascript
if (sdk.isAuthenticatedOrPending()) {
  sdk.wallet.connect();
}
```

## Usage

After authenticating your Player you can interact with the other methods of the
SDK. Here is the options that are currently available

### WALLET

| Method                    | Description               | Parameters | Returns         |
| ------------------------- | ------------------------- | ---------- | --------------- |
| `sdk.wallet.connect()`    | Authenticates Player      | ApiMode?   | `Promise<void>` |
| `sdk.wallet.getApiMode()` | Gets connected ApiMode    |            | `ApiMode`       |
| `sdk.wallet.getInfo()`    | Get Player info           |            | `IPlayer`       |
| `sdk.wallet.logout()`     | Remove Player credentials |            | `void`          |

**IPlayer example**

```javascript
{
 playerId: "40608c49-8a4f-4d0e-b7c5-11db9f0d58cb",
 walletAddress: "0x30B8dE91a8608c3000A28464Ddd4bB8b167F5C52",
 token: {
   sub: "40608c49-8a4f-4d0e-b7c5-11db9f0d58cb",
   walletAddress: "0x30B8dE91a8608c3000A28464Ddd4bB8b167F5C52",
   iat: 1665407792,
   exp: 1667999792,
   jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MDYwOGM0OS04YTRmLTRkMGUtYjdjNS0xMWRiOWYwZDU4Y2IiLCJ3YWxsZXRBZGRyZXNzIjoiMHgzMEI4ZEU5MWE4NjA4YzMwMDBBMjg0NjREZGQ0YkI4YjE2N0Y1QzUyIiwiaWF0IjoxNjY1NDA3NzkyLCJleHAiOjE2Njc5OTk3OTJ9.fT9zDtBHKsRuOzVFP4dtnzffaZfUNcBzTICPzRwLKRE"
 },
 authProvider: "google",
 email: "chainengine@chainengine.xyz",
 phoneNumber: null
}
```

### NFT

| Method             | Description                                  | Parameters                                                  | Returns               |
| ------------------ | -------------------------------------------- | ----------------------------------------------------------- | --------------------- |
| `sdk.nft.getById`  | Gets a single NFT that belongs to the player | `NFTId: string`                                             | `Promise<IPlayer>`    |
| `sdk.nft.getAll`   | Gets all NFTs that belongs to the Player     |                                                             | `IPaginated<IPlayer>` |
| `sdk.nft.transfer` | Transfers a NFT to another Wallet            | `{ walletAddress: string; nftId: string; amount: number; }` | `Promise<void>`       |

**INft example**

```javascript
{
  id: "af32e3ed-0de6-4b46-aa5f-18ea21d7f921",
  contractAddress: "0x107aC429D35adAb2e08d7C487000B48B8BA618Cf",
  onChainId: "22",
  chain: "mumbai",
  transactionHash: "0x94ed526e3e1a873b16539eeaf95dc826923d61ff9ba8062c9586f4da4d8016b7",
  accountId: "a0d89369-5524-40c3-bede-cef445633451",
  gameId: "9b45ddac-1714-4af6-addf-4406e2bb054c",
  status: "ONCHAIN",
  metadata: {
    name: "Example NFT",
    description: "This is an Example NFT. It has a huge supply",
    image: "http://api.chainengine.xyz/nfts/af32e3ed-0de6-4b46-aa5f-18ea21d7f921/image",
    attributes: null,
    URI: "ipfs://QmZa9mVH5HJFmoiS5tMTfQi3edbyWMjN9EtYKBBqhyrrMx"
  },
  holders: {
    bf9aad6f-8851-400f-bb3e-1bcb4c1dad9a: 110,
    09c0682a-7f10-4f0d-b83f-fe41949f8458: 100,
    40608c49-8a4f-4d0e-b7c5-11db9f0d58cb: 100
  },
  supply: 999,
  supplyAvailable: 689,
  createdAt: "2022-09-23T14:51:56.010Z"
}
```

IPaginated<INft> example

```javascript
{
  page: 1,
  offset: 0,
  total: 10,
  items: [
    {
      nfts: INft[]
    }
  ]
}
```

### MARKETPLACE

| Method                        | Description                       | Parameters          | Returns                         |
| ----------------------------- | --------------------------------- | ------------------- | ------------------------------- |
| `sdk.marketplace.getListings` | Gets listings related to the Game |                     | `Promise<ListingResponseDto[]>` |
| `sdk.marketplace.getListing`  | Gets a single Listing             | `listingId: string` | `Promise<ListingResponseDto>`   |
| `sdk.marketplace.buy`         | Buy a listing offer               | `listindId: string` | `Promise<ContractTransaction>`  |

**ListingResponseDto example**

```javascript
{
    id: "b87bf781-7283-4ddd-bba9-2eedd300d284",
    nft: INft,
    amount: 10,
    price: 1,
    receiverWallet: "0x359ea9Bc6d3c771d18905dB828ed5c4a655B61d2",
    protocolOffer: {
      parameters: {
        offerer: "0x59F06e983964bA5DD9b788f33fa1e5201b6BdDb3",
        zone: "0x0000000000000000000000000000000000000000",
        zoneHash: "0x3000000000000000000000000000000000000000000000000000000000000000",
        startTime: "1664999732",
        endTime: "115792089237316195423570985008687907853269984665640564039457584007913129639935",
        orderType: 0,
        offer: [
          {
            itemType: 3,
            token: "0x107aC429D35adAb2e08d7C487000B48B8BA618Cf",
            identifierOrCriteria: "22",
            startAmount: "10",
            endAmount: "10"
          }
        ],
        consideration: [
          {
            itemType: 0,
            token: "0x0000000000000000000000000000000000000000",
            identifierOrCriteria: "0",
            startAmount: "1000000000000000000",
            endAmount: "1000000000000000000",
            recipient: "0x359ea9Bc6d3c771d18905dB828ed5c4a655B61d2"
          }
        ],
        totalOriginalConsiderationItems: 1,
        salt: "0x00000000d86e742f62e10600",
        conduitKey: "0x0000000000000000000000000000000000000000000000000000000000000000",
        counter: 0
      },
      signature: "string-with-signature"
    },
    status: "active"
  }
```

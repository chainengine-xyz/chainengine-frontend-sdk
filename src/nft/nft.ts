import { AuthContext } from '../AuthContext';
import { WalletService } from '../wallet';
import { SignedTransactionRequestDto } from './nft.dto';
import { NftService } from './nft.service';

export class NFT {
  private readonly projectId: string;
  private readonly nftService: NftService;
  private readonly walletService: WalletService;

  constructor(
    projectId: string,
    nftService: NftService,
    walletService: WalletService
  ) {
    this.projectId = projectId;
    this.nftService = nftService;
    this.walletService = walletService;
  }
  getById(nftId: string) {
    try {
      if (!AuthContext.isAuthenticated()) {
        throw new Error('User is not authenticated');
      }
      return this.nftService.getById(nftId);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  getAll() {
    if (!AuthContext.isAuthenticated()) {
      throw new Error('User is not authenticated');
    }
    return this.nftService.getAll(this.projectId);
  }

  async transfer(signedTransactionRequestDto: SignedTransactionRequestDto) {
    if (!AuthContext.isAuthenticated()) {
      throw new Error('User is not authenticated');
    }

    // TODO: It is not acually transfer, it is CREATE PENDING SIGNED TRANSACTIONS. Transfer indeed happens later
    const transfer = await this.nftService.transfer(
      signedTransactionRequestDto
    );
    const signature = await this.walletService.signTypedData(transfer);

    return this.nftService.signTransfer(transfer.id, signature);
  }

  // getHistory(nftId: string) {
  //   throw new Error('To be implemented');
  // }
  // burn(nftId: string) {
  //   throw new Error('To be implemented');
  // }
}

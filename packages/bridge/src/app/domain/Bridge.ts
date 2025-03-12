import 'reflect-metadata';

import {
  TransferObject,
  UserTransferRequest,
  UserTransferState,
} from './UserTransferRequest';
import { Type } from 'class-transformer';
import { UserBalances } from './UserBalances';
import { EthereumUtils } from '../../_common/EthereumUtils';
import { Config } from '../ports/IConfigPort';

export type Address = string;

export class Bridge {
  @Type(() => String)
  currentUserTransfers: Map<string, UserTransferRequest>;
  @Type(() => UserBalances)
  userBalances: UserBalances;

  constructor(
    private config: Config,
    currentUserTransfersIds: Map<Address, UserTransferRequest>,
    userBalances: UserBalances,
  ) {
    // NOTE: I should compute that from transferObjectsIds
    this.currentUserTransfers = currentUserTransfersIds;
    this.userBalances = userBalances;
  }

  static empty(config: Config) {
    return new Bridge(
      config,
      new Map<Address, UserTransferRequest>(),
      UserBalances.empty(),
    );
  }

  /*
   * Verifies and then adds transfer objects to queue
   */
  async addTransferObject(transferObject: TransferObject) {
    // check if enough balance
    const remainingUserBalance = this.userBalances.getUserRemainingBalance(
      transferObject.sender,
      transferObject.token.address,
    );
    const amountRequestedToTransfer = EthereumUtils.toWei(
      transferObject.token.amount.toString(),
    );
    if (remainingUserBalance.lt(amountRequestedToTransfer)) return;

    // check if we have active transfer for this user and chain
    const userChainKey = this.getUserChainKey(transferObject);
    const newUserTransferRequest = new UserTransferRequest(transferObject);
    if (this.currentUserTransfers.has(userChainKey)) return;

    newUserTransferRequest.updateState(UserTransferState.TRANSFER_OBJECT_VALIDATED);
    await newUserTransferRequest.addSignature(this.config.BRIDGE_ACCOUNT_PK);

    this.currentUserTransfers.set(userChainKey, newUserTransferRequest);
  }

  private getUserChainKey(transferObject: TransferObject) {
    return `${transferObject.sender}-${transferObject.refund.chainId}`;
  }
}

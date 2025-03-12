import { UserTransferRequest } from './UserTransferRequest';
import { Type } from 'class-transformer';

export type Address = string;

export class Bridge {
  @Type(() => String)
  transferObjectsIds: Set<string>;
  transferObjectsQueue: UserTransferRequest[];
  @Type(() => String)
  currentUserTransfers: Map<Address, UserTransferRequest>;

  constructor(
    transferObjectsIds: Set<string>,
    transferObjectsQueue: UserTransferRequest[],
    currentUserTransfers: Map<Address, UserTransferRequest>,
  ) {
    this.transferObjectsIds = transferObjectsIds;
    this.transferObjectsQueue = transferObjectsQueue;
    this.currentUserTransfers = currentUserTransfers;
  }

  static empty() {
    return new Bridge(new Set(), [], new Map<Address, UserTransferRequest>());
  }

  addTransferObject(userTransferRequest: UserTransferRequest) {
    if (this.transferObjectsIds.has(userTransferRequest.id)) return;
    this.transferObjectsIds.add(userTransferRequest.id);
    this.transferObjectsQueue.push(userTransferRequest);
  }
}

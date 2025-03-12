import { Address } from './Bridge';
import { ethers } from 'ethers';
import { SignatureError } from './_DomainErrors';

export type TransferObject = {
  sender: Address;
  token: {
    address: Address;
    amount: number;
  };
  targetChain: {
    chainId: number;
    receiver: Address;
  };
  refund: {
    chainId: number;
    tx: string;
    signedTx: string;
  };
  signature: string;
};

enum UserTransferState {
  RECEIVED,
  TRANSFER_OBJECT_VALIDATED,
  SOURCE_CHAIN_TRANSFER_PENDING,
  SOURCE_CHAIN_TRANSFER_COMMITED,
  SOURCE_CHAIN_TRANSFER_FINALIZED,
  TARGET_CHAIN_TRANSFER_PENDING,
  TARGET_CHAIN_TRANSFER_COMMITED,
  TARGET_CHAIN_TRANSFER_FINALIZED,
}

export class UserTransferRequest {
  readonly id: string;
  state: UserTransferState;

  constructor(private readonly transferObject: TransferObject) {
    // TODO: validate fields (non zero, empty)
    this.verifySignatures(transferObject);

    // NOTE: I could create an id based on fields
    this.id = transferObject.signature;
    this.state = UserTransferState.RECEIVED;
  }

  private verifySignatures(transferObject: TransferObject) {
    // verify transferObject.refund.signedTx
    const recoveredAddress1 = ethers.utils.verifyMessage(
      transferObject.refund.tx,
      transferObject.refund.signedTx,
    );
    if (recoveredAddress1 !== transferObject.sender) {
      throw new SignatureError(`transferObject.refund.signedTx.signature is invalid.`);
    }

    // verify transferObject.signature
    const transferObjectData: Omit<TransferObject, 'signature'> = {
      sender: transferObject.sender,
      token: {
        address: transferObject.token.address,
        amount: transferObject.token.amount,
      },
      targetChain: {
        chainId: transferObject.targetChain.chainId,
        receiver: transferObject.targetChain.receiver,
      },
      refund: {
        chainId: transferObject.refund.chainId,
        tx: transferObject.refund.tx,
        signedTx: transferObject.refund.signedTx,
      },
    };

    const transferObjectDataString = JSON.stringify(transferObjectData);
    const recoveredAddress2 = ethers.utils.verifyMessage(
      transferObjectDataString,
      transferObject.signature,
    );
    if (recoveredAddress2 !== transferObject.sender) {
      throw new SignatureError(`transferObject.signature is invalid.`);
    }
  }

  equals(other: UserTransferRequest) {
    return this.id === other.id;
  }

  updateState(state: UserTransferState) {
    this.state = state;
  }
}

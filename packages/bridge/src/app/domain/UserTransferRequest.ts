import { Address } from './Bridge';
import { SignatureError } from './_DomainErrors';
import { EthereumUtils } from '../../_common/EthereumUtils';

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

export enum UserTransferState {
  RECEIVED,
  TRANSFER_OBJECT_VALIDATED,
  TARGET_CHAIN_TRANSFER_FINALIZED,
  SOURCE_CHAIN_TRANSFER_FINALIZED,
}

export class UserTransferRequest {
  readonly id: string;
  state: UserTransferState;
  signature: string;

  constructor(private readonly transferObject: TransferObject) {
    // TODO: validate fields (non zero, empty)
    // TODO: verifyRefundTx data
    this.verifySignatures(transferObject);

    // NOTE: I could create an id based on fields
    this.id = transferObject.signature;
    this.state = UserTransferState.RECEIVED;
  }

  /*
   * Verifies:
   * - transferObject.refund.signedTx against transferObject.refund.tx and sender address
   * - transferObject.signature signature against JSON.stringy(transferObject) and sender address
   */
  private verifySignatures(transferObject: TransferObject) {
    // verify transferObject.refund.signedTx
    const isRefundSignatureValid = EthereumUtils.isEthereumSignatureValid(
      transferObject.refund.tx,
      transferObject.refund.signedTx,
      transferObject.sender,
    );
    if (!isRefundSignatureValid) {
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
    const isTransferObjectSignatureValid = EthereumUtils.isEthereumSignatureValid(
      transferObjectDataString,
      transferObject.signature,
      transferObject.sender,
    );

    if (!isTransferObjectSignatureValid) {
      throw new SignatureError(`transferObject.signature is invalid.`);
    }
  }

  updateState(state: UserTransferState) {
    this.state = state;
  }

  async addSignature(pk: string) {
    this.signature = await EthereumUtils.signMessage(JSON.stringify(this), pk);
  }
}

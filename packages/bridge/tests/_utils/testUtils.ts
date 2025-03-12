import { randomBytes } from 'node:crypto';
import { ethers, Wallet } from 'ethers';
import { TransferObject } from '../../src/app/domain/UserTransferRequest';
import { getTestAccounts } from './accounts';
import { Address } from '../../src/app/domain/Bridge';

export function getRandomAddress() {
  const randomWallet = ethers.Wallet.createRandom();
  return randomWallet.address;
}

export function getRandomString(sizeBytes: number) {
  return randomBytes(sizeBytes).toString();
}

export async function getSignedTransferObject(
  transferObjectData: Omit<TransferObject, 'signature'>,
  wallet: Wallet,
): Promise<TransferObject> {
  const transferObjectDataSignature = await wallet.signMessage(
    JSON.stringify(transferObjectData),
  );

  return {
    sender: transferObjectData.sender,
    token: {
      address: transferObjectData.token.address,
      amount: transferObjectData.token.amount,
    },
    targetChain: {
      chainId: transferObjectData.targetChain.chainId,
      receiver: transferObjectData.targetChain.receiver,
    },
    refund: {
      chainId: transferObjectData.refund.chainId,
      tx: transferObjectData.refund.tx,
      signedTx: transferObjectData.refund.signedTx,
    },
    signature: transferObjectDataSignature,
  };
}

export async function getDefaultTransferObject(
  sender: Address,
  amount: number,
  targetChainId = 1,
  refundChainId = 1,
): Promise<TransferObject> {
  const txData = getRandomString(100);
  const chainAUserAWallet = new Wallet(getTestAccounts().chainA.userA.privateKey);
  const signedTx = await chainAUserAWallet.signMessage(txData);

  const transferObjectData: Omit<TransferObject, 'signature'> = {
    sender: sender,
    token: {
      address: getRandomAddress(),
      amount: amount,
    },
    targetChain: {
      chainId: targetChainId,
      receiver: getRandomAddress(),
    },
    refund: {
      chainId: refundChainId,
      tx: txData,
      signedTx: signedTx,
    },
  };

  return await getSignedTransferObject(transferObjectData, chainAUserAWallet);
}

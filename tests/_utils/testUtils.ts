import { randomBytes } from 'node:crypto';
import { ethers, Wallet } from 'ethers';
import { TransferObject } from '../../src/app/domain/UserTransferRequest';
import { getTestAccounts } from './accounts';

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

export async function getDefaultTransferObject(): Promise<TransferObject> {
  const txData = getRandomString(100);
  const chainAUserAWallet = new Wallet(getTestAccounts().chainA.userA.privateKey);
  const signedTx = await chainAUserAWallet.signMessage(txData);

  const transferObjectData: Omit<TransferObject, 'signature'> = {
    sender: getTestAccounts().chainA.userA.address,
    token: {
      address: getRandomAddress(),
      amount: 10,
    },
    targetChain: {
      chainId: 1,
      receiver: getRandomAddress(),
    },
    refund: {
      chainId: 1,
      tx: txData,
      signedTx: signedTx,
    },
  };

  return await getSignedTransferObject(transferObjectData, chainAUserAWallet);
}

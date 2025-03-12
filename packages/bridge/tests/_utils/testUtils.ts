import { randomBytes } from 'node:crypto';
import { ethers, Wallet } from 'ethers';
import { TransferObject } from '../../src/app/domain/UserTransferRequest';
import { getTestAccounts } from './accounts';
import { Address } from '../../src/app/domain/Bridge';
import { Config } from '../../src/app/ports/IConfigPort';

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

export const bridgeTestConfig: Config = {
  BRIDGE_ACCOUNT_ADDRESS: getTestAccounts().bridge.address,
  BRIDGE_ACCOUNT_PK: getTestAccounts().bridge.privateKey,

  CHAIN_A_URL: 'http://127.0.0.1:8545',
  CHAIN_A_PORT: 8545,
  CHAIN_A_ID: 1337,
  CHAIN_A_SOLVER_ACCOUNT_ADDRESS: getTestAccounts().chainA.solver.address,
  CHAIN_A_TOKEN_A_ADDRESS: '',
  CHAIN_A_TOKEN_B_ADDRESS: '',

  CHAIN_B_URL: 'http://127.0.0.1:8546',
  CHAIN_B_PORT: 8546,
  CHAIN_B_ID: 3117,
  CHAIN_B_SOLVER_ACCOUNT_ADDRESS: getTestAccounts().chainB.solver.address,
  CHAIN_B_TOKEN_A_ADDRESS: '',
  CHAIN_B_TOKEN_B_ADDRESS: '',
};

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

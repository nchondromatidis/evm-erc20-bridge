import {
  TransferObject,
  UserTransferRequest,
} from '../../../src/app/domain/UserTransferRequest';
import { getTestAccounts } from '../../_utils/accounts';
import { Wallet } from 'ethers';
import {
  getRandomAddress,
  getRandomString,
  getSignedTransferObject,
} from '../../_utils/testUtils';

describe('UserTransfer', () => {
  it('valid signature', async () => {
    // arrange
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

    const transferObject = await getSignedTransferObject(
      transferObjectData,
      chainAUserAWallet,
    );

    // act
    new UserTransferRequest(transferObject);

    // assert
    // not throw
  });

  it('invalid signedTx', async () => {
    // arrange
    const txData = getRandomString(100);
    const chainAUserAWallet = new Wallet(getTestAccounts().chainA.userA.privateKey);

    const tx2Data = getRandomString(100);
    const signedTx = await chainAUserAWallet.signMessage(tx2Data);

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

    const transferObject = await getSignedTransferObject(
      transferObjectData,
      chainAUserAWallet,
    );

    // act/assert
    const createInstance = () => new UserTransferRequest(transferObject);
    expect(createInstance).toThrow();
  });

  it('invalid signature', async () => {
    // arrange
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

    const transferObject = await getSignedTransferObject(
      transferObjectData,
      chainAUserAWallet,
    );

    const transferObjectData2 = structuredClone(transferObjectData);
    transferObjectData2.token.amount = 20;

    const transferObject2: TransferObject = {
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
      signature: transferObject.signature,
    };

    // act/assert
    const createInstance = () => new UserTransferRequest(transferObject2);
    expect(createInstance).toThrow();
  });
});

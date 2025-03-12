import 'reflect-metadata';

import { getDefaultTransferObject } from '../../_utils/testUtils';
import { FileSystemBridgeRepo } from '../../../src/adapters/repository/FileSystemBridgeRepo';
import { ReceiveNewTransferObject } from '../../../src/app/use-cases/ReceiveNewTransferObject';
import { Config } from '../../../src/app/ports/IConfigPort';
import { getTestAccounts } from '../../_utils/accounts';
import { EthereumUtils } from '../../../src/_common/EthereumUtils';

const bridgeTestConfig: Config = {
  BRIDGE_ACCOUNT_ADDRESS: getTestAccounts().bridge.address,
  BRIDGE_ACCOUNT_PK: getTestAccounts().bridge.privateKey,

  CHAIN_A_URL: '',
  CHAIN_A_PORT: 0,
  CHAIN_A_SOLVER_ACCOUNT_ADDRESS: getTestAccounts().chainA.solver.address,

  CHAIN_B_URL: '',
  CHAIN_B_PORT: 0,
  CHAIN_B_SOLVER_ACCOUNT_ADDRESS: getTestAccounts().chainB.solver.address,
};

describe('ReceiveNewTransferObject', () => {
  it('when valid transfer object is received, then is it added in the queue', async () => {
    // arrange
    const bridgeRepo = new FileSystemBridgeRepo(bridgeTestConfig);
    await bridgeRepo.init(true);
    const receiveNewTransferObject = new ReceiveNewTransferObject(
      bridgeTestConfig,
      bridgeRepo,
    );

    const to = await getDefaultTransferObject(getTestAccounts().chainA.userA.address, 10);

    const bridgeBefore = await bridgeRepo.get();
    bridgeBefore.userBalances.addUserBalance(
      getTestAccounts().chainA.userA.address,
      to.token.address,
      EthereumUtils.toWei('20'),
    );
    await bridgeRepo.save(bridgeBefore);

    // act
    await receiveNewTransferObject.handle(to);

    // assert
    const bridgeAfter = await bridgeRepo.get();

    const userChainKey = `${to.sender}-${to.refund.chainId}`;
    expect(bridgeAfter.currentUserTransfers.has(userChainKey)).toBeTruthy();
  });

  it('when valid transfer object amount is less that user-chain remained, then it is not added in the queue', async () => {
    // arrange
    const bridgeRepo = new FileSystemBridgeRepo(bridgeTestConfig);
    await bridgeRepo.init(true);
    const receiveNewTransferObject = new ReceiveNewTransferObject(
      bridgeTestConfig,
      bridgeRepo,
    );

    const to = await getDefaultTransferObject(getTestAccounts().chainA.userA.address, 21);

    const bridgeBefore = await bridgeRepo.get();

    bridgeBefore.userBalances.addUserBalance(
      getTestAccounts().chainA.userA.address,
      to.token.address,
      EthereumUtils.toWei('20'),
    );
    await bridgeRepo.save(bridgeBefore);

    // act
    await receiveNewTransferObject.handle(to);

    // assert
    const bridgeAfter = await bridgeRepo.get();

    const userChainKey = `${to.sender}-${to.refund.chainId}`;
    expect(bridgeAfter.currentUserTransfers.has(userChainKey)).toBeFalsy();
  });
});

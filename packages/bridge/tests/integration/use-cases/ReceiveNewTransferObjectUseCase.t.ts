import { bridgeTestConfig, getDefaultTransferObject } from '../../_utils/testUtils';
import { FileSystemBridgeRepo } from '../../../src/adapters/repository/FileSystemBridgeRepo';
import { ReceiveNewTransferObjectUseCase } from '../../../src/app/use-cases/ReceiveNewTransferObjectUseCase';
import { getTestAccounts } from '../../_utils/accounts';
import { EthereumUtils } from '../../../src/_common/EthereumUtils';

describe('ReceiveNewTransferObjectUseCase', () => {
  it('when valid transfer object is received, then is it added in the queue', async () => {
    // arrange
    const bridgeRepo = new FileSystemBridgeRepo(bridgeTestConfig);
    await bridgeRepo.init(true);
    const receiveNewTransferObject = new ReceiveNewTransferObjectUseCase(
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
    const receiveNewTransferObject = new ReceiveNewTransferObjectUseCase(
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

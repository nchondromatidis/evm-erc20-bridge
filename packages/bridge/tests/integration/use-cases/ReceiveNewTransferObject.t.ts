import { getDefaultTransferObject } from '../../_utils/testUtils';
import { FileSystemBridgeRepo } from '../../../src/adapters/repository/FileSystemBridgeRepo';
import { ReceiveNewTransferObject } from '../../../src/app/use-cases/ReceiveNewTransferObject';

describe('ReceiveNewTransferObject', () => {
  it('happy path', async () => {
    // arrange
    const bridgeRepo = new FileSystemBridgeRepo();
    await bridgeRepo.init();
    const receiveNewTransferObject = new ReceiveNewTransferObject(bridgeRepo);

    const to = await getDefaultTransferObject();
    // act
    await receiveNewTransferObject.handle(to);

    // assert
    const bridge = await bridgeRepo.get();
    expect(bridge.transferObjectsIds.size).toEqual(1);
    expect(bridge.transferObjectsQueue.length).toEqual(1);
  });
});

import { ChildProcess } from 'child_process';
import { setupSystem } from '../setup';
import { EthereumUtils } from '../../../src/_common/EthereumUtils';
import { InitSystemUseCase } from '../../../src/app/use-cases/InitSystemUseCase';
import { JsonRpcAdapter } from '../../../src/adapters/ethereum/JsonRpcAdapter';
import { FileSystemBridgeRepo } from '../../../src/adapters/repository/FileSystemBridgeRepo';
import { EnvVarsConfig } from '../../../src/adapters/config/EnvVarsConfig';
import { getTestAccounts } from '../../_utils/accounts';
import { sleep } from '../../_utils/testUtils';

const initialErc20Supply = EthereumUtils.toWei('1000');
const usersErc20Funds = EthereumUtils.toWei('100');

jest.setTimeout(20000);

describe('InitSystemUseCase', () => {
  let chainAProcess: ChildProcess;
  let chainBProcess: ChildProcess;

  let initSystemUseCase: InitSystemUseCase;

  beforeAll(async () => {});

  afterAll(() => {
    if (chainAProcess) chainAProcess.kill();
    if (chainBProcess) chainBProcess.kill();
  });

  it('check if events are picked up', async () => {
    // arrange
    const system = await setupSystem(initialErc20Supply, usersErc20Funds);
    chainAProcess = system.chainAProcess;
    chainBProcess = system.chainBProcess;

    const configService = new EnvVarsConfig(system.bridgeTestConfig);

    const jsonRpcAdapter = new JsonRpcAdapter(system.bridgeTestConfig);
    const bridgeRepo = new FileSystemBridgeRepo(system.bridgeTestConfig);
    await bridgeRepo.init(true);

    initSystemUseCase = new InitSystemUseCase(configService, jsonRpcAdapter, bridgeRepo);

    const bridge = await bridgeRepo.get();

    // act
    await initSystemUseCase.handle();

    // assert

    await sleep(5000);

    const userAChainATokenABalance = bridge.userBalances.getUserBalance(
      getTestAccounts().chainA.userA.address,
      configService.get().CHAIN_A_TOKEN_A_ADDRESS,
    );

    expect(userAChainATokenABalance.eq(usersErc20Funds)).toEqual(true);
  });
});

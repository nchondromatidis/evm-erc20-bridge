import { ChildProcess } from 'child_process';
import { ethers } from 'ethers';
import { setupSystem } from './_setup';
import { getTestAccounts } from 'bridge-service/tests/_utils/accounts';
import { EthereumUtils } from 'bridge-service/src/_common/EthereumUtils';

jest.setTimeout(20000);

const initialErc20Supply = EthereumUtils.toWei('1000');
const usersErc20Funds = EthereumUtils.toWei('100');

describe('transfer-flow', () => {
  let chainAProcess: ChildProcess;
  let chainBProcess: ChildProcess;

  let chainATokenASolverAccountContract: ethers.Contract;

  beforeAll(async () => {
    const system = await setupSystem(initialErc20Supply, usersErc20Funds);
    chainAProcess = system.chainAProcess;
    chainBProcess = system.chainBProcess;

    chainATokenASolverAccountContract = system.chainATokenASolverAccountContract;
  });

  afterAll(() => {
    if (chainAProcess) chainAProcess.kill();
    if (chainBProcess) chainBProcess.kill();
  });

  it('happy path', async () => {
    // arrange
    const chainAUserATokenABalanceBefore =
      await chainATokenASolverAccountContract.balanceOf(
        getTestAccounts().chainA.userA.address,
      );

    console.debug(chainAUserATokenABalanceBefore);

    // act

    // assert
  });
});

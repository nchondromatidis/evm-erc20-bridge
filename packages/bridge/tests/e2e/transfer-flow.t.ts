import { ChildProcess } from 'child_process';
import { ethers } from 'ethers';
import { setupSystem } from './_setup';
import { getTestAccounts } from '../_utils/accounts';

jest.setTimeout(20000);

const initialErc20Supply = ethers.utils.parseUnits('1000', 'gwei');
const usersErc20Funds = ethers.utils.parseUnits('100', 'gwei');

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

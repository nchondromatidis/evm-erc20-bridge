import { ethers } from 'ethers';
import * as IERC20 from '@openzeppelin/contracts/build/contracts/IERC20.json';
import { Config } from '../../app/ports/IConfigPort';
import { IBalanceChangeEventsListener } from '../../app/ports/IBalanceChangeEventsListener';

export class JsonRpcAdapter implements IBalanceChangeEventsListener {
  constructor(private config: Config) {}

  // assume ERC20
  registerHandler(
    tokenAddress: string,
    chainUrl: string,
    handler: (from: string, to: string, value: string) => Promise<void>,
  ): void {
    const provider = new ethers.providers.JsonRpcProvider(chainUrl);
    const erc20TokenContract = new ethers.Contract(tokenAddress, IERC20.abi, provider);
    erc20TokenContract.on('Transfer', handler);
  }
}

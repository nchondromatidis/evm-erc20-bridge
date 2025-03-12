import { IConfigPort } from '../ports/IConfigPort';
import { IBalanceChangeEventsListener } from '../ports/IBalanceChangeEventsListener';
import { IBridgeRepo } from '../ports/IBridgeRepo';
import { BigNumber } from 'ethers';

export class InitSystemUseCase {
  constructor(
    private config: IConfigPort,
    private balanceChangeEventsListener: IBalanceChangeEventsListener,
    private bridgeRepo: IBridgeRepo,
  ) {}

  async handle() {
    for (const chainInfo of this.config.getTokensInfo()) {
      this.balanceChangeEventsListener.registerHandler(
        chainInfo.tokenAddress,
        chainInfo.chainUrl,
        async (from: string, to: string, value: string) => {
          const bridge = await this.bridgeRepo.get();
          // NOTE: I track all users from initial block to save coding time
          bridge.userBalances.addUserBalance(
            to,
            chainInfo.tokenAddress,
            BigNumber.from(value),
          );
          bridge.userBalances.removeUserBalance(
            from,
            chainInfo.tokenAddress,
            BigNumber.from(value),
          );
          await this.bridgeRepo.save(bridge);
        },
      );
    }
  }
}

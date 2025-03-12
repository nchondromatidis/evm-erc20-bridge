export interface IBalanceChangeEventsListener {
  registerHandler(
    tokenAddress: string,
    chainUrl: string,
    handler: (from: string, to: string, value: string) => Promise<void>,
  ): void;
}

import 'reflect-metadata';

import { Address } from './Bridge';
import { BigNumber } from 'ethers';
import { Type } from 'class-transformer';

export class UserBalances {
  @Type(() => String)
  public userBalances: Map<Address, string>;
  @Type(() => String)
  public userLockedBalances: Map<Address, string>;
  public lastUpdatedBlock: number;

  constructor(
    blockUserBalances: Map<Address, string>,
    blockUserLockedBalances: Map<Address, string>,
    block: number,
  ) {
    this.userBalances = blockUserBalances;
    this.userLockedBalances = blockUserLockedBalances;
    this.lastUpdatedBlock = block;
  }

  static empty() {
    return new UserBalances(new Map(), new Map(), 0);
  }

  // getters

  getUserRemainingBalance(user: Address, token: Address) {
    return this.getUserBalance(user, token).sub(this.getUserLockedBalance(user, token));
  }

  getUserBalance(user: Address, token: Address) {
    const userTokenKey = this.getUserTokenKey(user, token);
    if (this.userBalances.has(userTokenKey)) {
      return BigNumber.from(this.userBalances.get(userTokenKey));
    }
    return BigNumber.from(0);
  }

  getUserLockedBalance(user: Address, token: Address) {
    const userTokenKey = this.getUserTokenKey(user, token);
    if (this.userLockedBalances.has(userTokenKey)) {
      return BigNumber.from(this.userLockedBalances.get(userTokenKey));
    }
    return BigNumber.from(0);
  }

  // user balance

  addUserBalance(user: Address, token: Address, amount: BigNumber) {
    const userTokenKey = this.getUserTokenKey(user, token);
    this.updateUserBalance(userTokenKey, this.getUserBalance(user, token).add(amount));
  }

  removeUserBalance(user: Address, token: Address, amount: BigNumber) {
    const userTokenKey = this.getUserTokenKey(user, token);
    this.updateUserBalance(userTokenKey, this.getUserBalance(user, token).sub(amount));
  }

  private updateUserBalance(userTokenKey: string, amount: BigNumber) {
    if (!this.userBalances.has(userTokenKey)) {
      this.userBalances.set(userTokenKey, '0');
    }
    this.userBalances.set(userTokenKey, amount.toString());
  }

  // user lock balance

  addUserLockedBalance(user: Address, token: Address, amount: BigNumber) {
    const userTokenKey = this.getUserTokenKey(user, token);
    this.updateUserLockedBalance(
      userTokenKey,
      this.getUserBalance(user, token).add(amount),
    );
  }

  removeUserLockedBalance(user: Address, token: Address, amount: BigNumber) {
    const userTokenKey = this.getUserTokenKey(user, token);
    this.updateUserLockedBalance(
      userTokenKey,
      this.getUserBalance(user, token).add(amount),
    );
  }

  private updateUserLockedBalance(userTokenKey: string, amount: BigNumber) {
    if (!this.userLockedBalances.has(userTokenKey)) {
      this.userLockedBalances.set(userTokenKey, amount.toString());
    }
    this.userLockedBalances.set(userTokenKey, amount.toString());
  }

  // helpers
  private getUserTokenKey(user: Address, token: Address) {
    return `${user}-${token}`;
  }
}

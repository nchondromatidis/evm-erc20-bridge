import * as RT from 'runtypes';
import { Static } from 'runtypes';
import { Address } from '../domain/Bridge';

export type ChainInfo = {
  chainId: number;
  url: string;
  port: number;
};

export type TokenInfo = {
  chainId: number;
  chainUrl: string;
  tokenAddress: Address;
};

export const EnvVarsConfigSchema = RT.Object({
  BRIDGE_ACCOUNT_ADDRESS: RT.String,
  BRIDGE_ACCOUNT_PK: RT.String,

  CHAIN_A_ID: RT.Number,
  CHAIN_A_URL: RT.String,
  CHAIN_A_PORT: RT.Number,
  CHAIN_A_SOLVER_ACCOUNT_ADDRESS: RT.String,
  CHAIN_A_TOKEN_A_ADDRESS: RT.String,
  CHAIN_A_TOKEN_B_ADDRESS: RT.String,

  CHAIN_B_ID: RT.Number,
  CHAIN_B_URL: RT.String,
  CHAIN_B_PORT: RT.Number,
  CHAIN_B_SOLVER_ACCOUNT_ADDRESS: RT.String,
  CHAIN_B_TOKEN_A_ADDRESS: RT.String,
  CHAIN_B_TOKEN_B_ADDRESS: RT.String,
});

export type Config = Static<typeof EnvVarsConfigSchema>;

export interface IConfigPort {
  get(): Config;
  getChainsInfo(): ChainInfo[];
  getTokensInfo(): TokenInfo[];
}

import * as RT from 'runtypes';
import { Static } from 'runtypes';

export const EnvVarsConfigSchema = RT.Object({
  BRIDGE_ACCOUNT_ADDRESS: RT.String,
  BRIDGE_ACCOUNT_PK: RT.String,

  CHAIN_A_URL: RT.String,
  CHAIN_A_PORT: RT.Number,
  CHAIN_A_SOLVER_ACCOUNT_ADDRESS: RT.String,

  CHAIN_B_URL: RT.String,
  CHAIN_B_PORT: RT.Number,
  CHAIN_B_SOLVER_ACCOUNT_ADDRESS: RT.String,
});

export type Config = Static<typeof EnvVarsConfigSchema>;

export interface IConfigPort {
  get(): Config;
}

import {
  ChainInfo,
  Config,
  EnvVarsConfigSchema,
  IConfigPort,
  TokenInfo,
} from '../../app/ports/IConfigPort';

export class EnvVarsConfig implements IConfigPort {
  private readonly config: Config;

  constructor(envVars: Record<string, unknown>) {
    this.config = EnvVarsConfigSchema.parse(envVars);
  }

  getChainsInfo(): ChainInfo[] {
    return [
      {
        url: this.config.CHAIN_A_URL,
        chainId: this.config.CHAIN_A_ID,
        port: this.config.CHAIN_A_PORT,
      },
      {
        url: this.config.CHAIN_B_URL,
        chainId: this.config.CHAIN_B_ID,
        port: this.config.CHAIN_B_PORT,
      },
    ];
  }

  getTokensInfo(): TokenInfo[] {
    return [
      {
        chainId: this.config.CHAIN_A_ID,
        chainUrl: this.config.CHAIN_A_URL,
        tokenAddress: this.config.CHAIN_A_TOKEN_A_ADDRESS,
      },
      {
        chainId: this.config.CHAIN_A_ID,
        chainUrl: this.config.CHAIN_A_URL,
        tokenAddress: this.config.CHAIN_A_TOKEN_B_ADDRESS,
      },
      {
        chainId: this.config.CHAIN_B_ID,
        chainUrl: this.config.CHAIN_B_URL,
        tokenAddress: this.config.CHAIN_B_TOKEN_A_ADDRESS,
      },
      {
        chainId: this.config.CHAIN_B_ID,
        chainUrl: this.config.CHAIN_B_URL,
        tokenAddress: this.config.CHAIN_B_TOKEN_B_ADDRESS,
      },
    ];
  }

  get(): Config {
    return this.config;
  }
}

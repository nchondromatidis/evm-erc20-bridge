import { Config, EnvVarsConfigSchema, IConfigPort } from '../../app/ports/IConfigPort';

export class EnvVarsConfig implements IConfigPort {
  private readonly config: Config;

  constructor(envVars: Record<string, unknown>) {
    this.config = EnvVarsConfigSchema.parse(envVars);
  }

  get(): Config {
    return this.config;
  }
}

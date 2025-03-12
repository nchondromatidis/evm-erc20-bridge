import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IBridgeRepo } from '../../app/ports/IBridgeRepo';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { Bridge } from '../../app/domain/Bridge';
import { Config } from '../../app/ports/IConfigPort';

const defaultDataFilePath = path.join(__dirname, 'data', 'data.json');

export class FileSystemBridgeRepo implements IBridgeRepo {
  private bridge: Bridge;

  constructor(
    private config: Config,
    private dataFilePath: string = defaultDataFilePath,
  ) {}

  async save(bridge: Bridge): Promise<void> {
    const bridgeSerialised = this.serialise(bridge);
    fs.writeFileSync(this.dataFilePath, bridgeSerialised);
  }

  async get(): Promise<Bridge> {
    return this.bridge;
  }

  async init(removeOldData = false): Promise<void> {
    if (!fs.existsSync(this.dataFilePath) || removeOldData) {
      const emptyBridge = Bridge.empty(this.config);
      await this.save(emptyBridge);
    }
    this.bridge = this.deserialise();
  }

  private serialise(bridge: Bridge) {
    return JSON.stringify(instanceToPlain(bridge));
  }

  private deserialise() {
    const bridgeSerialised = fs.readFileSync(this.dataFilePath).toString();
    return plainToInstance(Bridge, JSON.parse(bridgeSerialised));
  }
}

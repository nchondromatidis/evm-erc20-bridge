import 'reflect-metadata';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { IBridgeRepo } from '../../app/ports/IBridgeRepo';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { Bridge } from '../../app/domain/Bridge';

const defaultDataFilePath = path.join(__dirname, 'data', 'data.json');

export class FileSystemBridgeRepo implements IBridgeRepo {
  private bridge: Bridge;

  constructor(private dataFilePath: string = defaultDataFilePath) {}

  async save(bridge: Bridge): Promise<void> {
    const bridgeSerialised = this.serialise(bridge);
    fs.writeFileSync(this.dataFilePath, bridgeSerialised);
  }

  async get(): Promise<Bridge> {
    return this.bridge;
  }

  async init() {
    if (!fs.existsSync(this.dataFilePath)) {
      const emptyBridge = Bridge.empty();
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
